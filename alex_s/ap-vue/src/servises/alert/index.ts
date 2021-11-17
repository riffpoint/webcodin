import { Alert, AlertType } from "./alert.model";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";

class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = "default-alert";

  // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter((x) => x && x.id === id));
  }

  // convenience methods
  success(title: string, message: string, options?: Alert) {
    this.alert(
      new Alert({ ...options, type: AlertType.Success, message, title })
    );
  }

  error(title: string, message: string, options?: Alert) {
    this.alert(
      new Alert({ ...options, type: AlertType.Error, message, title })
    );
  }

  info(title: string, message: string, options?: Alert) {
    this.alert(new Alert({ ...options, type: AlertType.Info, message, title }));
  }

  warn(title: string, message: string, options?: Alert) {
    this.alert(
      new Alert({ ...options, type: AlertType.Warning, message, title })
    );
  }

  // main alert method
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
}

export default new AlertService();