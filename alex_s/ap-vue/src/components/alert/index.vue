<template>
  <div v-for="(alert, i) of alerts" :class="cssClass(alert)" :key="i">
    <div class="alert__container">
      <div class="alert__icon"><i :class="iconClass(alert)"></i></div>
      <div class="alert__title">{{ alert.title }}</div>
      <div class="alert__text">{{ alert.message }}</div>
      <div
        v-if="
          alert.type === AlertType.Warning || alert.type === AlertType.Danger
        "
        class="alert__btns"
      >
        <button
          :class="btnClass(alert)"
          type="button"
          @click="removeAlert(alert)"
        >
          Try Again
        </button>
      </div>

      <div v-if="alert.type === AlertType.Success" class="alert__btns">
        <button
          :class="btnClass(alert)"
          type="button"
          @click="removeAlert(alert)"
        >
          Continue
        </button>
      </div>
      <button class="alert__close" type="button" @click="removeAlert(alert)">
        <i class="la la-close"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { onUnmounted } from "@vue/runtime-core";
import { AlertType, Alert } from "@/servises/alert/alert.model";
import AlertService from "@/servises/alert";

export default defineComponent({
  setup() {
    const alerts = ref<Alert[]>([]);
    const id = ref("default-alert");
    const fade = true;

    const removeAlert = (alert: Alert) => {
      // check if already removed to prevent error on auto close
      if (!alerts.value.includes(alert)) return;

      if (fade) {
        // fade out alert
        const res = alerts.value.find((x) => x === alert);

        if (res) res.fade = true;

        // remove alert after faded out
        setTimeout(() => {
          alerts.value = alerts.value.filter((x) => x !== alert);
        }, 250);
      } else {
        // remove alert
        alerts.value = alerts.value.filter((x) => x !== alert);
      }
    };

    const alertSubscription = AlertService.onAlert(id.value).subscribe(
      (alert) => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          alerts.value = alerts.value.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          alerts.value.forEach((x) => delete x.keepAfterRouteChange);
          return;
        }

        // add alert to array
        alerts.value.push(alert);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000);
        }
      }
    );

    onUnmounted(() => {
      alertSubscription.unsubscribe();
    });

    return {
      alerts,
      id,
      fade,
      removeAlert,
      AlertType,
    };
  },
  methods: {
    cssClass(alert: Alert) {
      if (!alert) return;

      const classes = ["alert", "alert-dismissable"];

      const alertTypeClass: { [key: string]: string } = {
        [AlertType.Success]: "alert alert--success",
        [AlertType.Error]: "alert alert--danger",
        [AlertType.Info]: "alert alert--info",
        [AlertType.Warning]: "alert alert--warning",
      };

      classes.push(alertTypeClass[alert.type?.toString() || ""]);

      if (alert.fade) {
        classes.push("fade");
      }

      return classes.join(" ");
    },

    btnClass(alert: Alert) {
      if (!alert) return;

      const classes = ["btn"];

      const alertTypeClass: { [key: string]: string } = {
        [AlertType.Success]: "btn btn--success",
        [AlertType.Error]: "btn btn--red",
        [AlertType.Info]: "btn btn--info",
        [AlertType.Warning]: "btn btn--orange",
      };

      classes.push(alertTypeClass[alert.type?.toString() || ""]);

      return classes.join(" ");
    },

    iconClass(alert: Alert) {
      if (!alert) return;

      const classes = ["la"];

      const alertTypeClass: { [key: string]: string } = {
        [AlertType.Success]: "las la-check",
        [AlertType.Error]: "las la-trash",
        [AlertType.Info]: "la la--info",
        [AlertType.Warning]: "las la-times",
      };

      classes.push(alertTypeClass[alert.type?.toString() || ""]);

      return classes.join(" ");
    },
  },
});
</script>
