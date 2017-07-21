var handleValidation = function () {
    var form = $('#order_valid');
    var error1 = $('.alert-danger', form);
    var success1 = $('.alert-success', form);

    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "", // validate all fields including form hidden input
        messages: {
            select_multi: {
                maxlength: jQuery.validator.format("Max {0} items allowed for selection"),
                minlength: jQuery.validator.format("At least {0} items must be selected")
            }
        },
        rules: {
            user_name: {
                minlength: 2,
                required: true
            },
            user_email: {
                required: true,
                email: true
            },
        },
        invalidHandler: function (event, validator) { //display error alert on form submit 
            success1.hide();
            error1.show();
            Metronic.scrollTo(error1, -200);
        },
        highlight: function (element) { // hightlight error inputs
            $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
        },
        success: function (label) {
            label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
        },
        submitHandler: function (form) {

        }
    });
};

var Settings = function () {
    var bindDate = [];
    var freeTime = [];
    var workSchedule = [];
    return {
        init: function () {
            $.ajax({
                url: urls.setting,
                type: 'post',
                dataType: 'json',
                success: function (data) {

                    if (data) {
                        bindDate = data.bindDates;
                        workSchedule = data.workSchedule;
                        freeTime = data.freeTime;
                    }
                    Calendar.init();
                }
            });
        },
        isBind: function (oMoment) {
            if ($.inArray(oMoment.format('YYYY-MM-DD'), bindDate) >= 0) {
                return true;
            } else {
                return false;
            }
        },
        getScheduleByDate: function (oMoment) {
            var length = workSchedule.length;
            for (i = 0; i < length; i++) {
                if (workSchedule[i].date == oMoment.format('YYYY-MM-DD')) {
                    return workSchedule[i].listTime;
                }
            }
            return [];
        },
        getFreeTimeByDate: function (oMoment) {
            return freeTime[oMoment.format('YYYY-MM-DD')];
        },
    };
}();

var myAlerts = function () {
    var prepareEvent = function (event) {
        var prepared = {};
        var start = event.start.format().split('+');
        if (typeof start[0].split('T')[1] == 'undefined')
        {
            start[0] += 'T00:00:00';
        }
        if ($.isEmptyObject(event.end)) {
            var dateTo = [];
        } else {
            var dateTo = event.end.format().split('+');
        }
        prepared.id = (typeof event.id == 'number') ? event.id : '';
        prepared.clientName = event.usName;
        prepared.clientEmail = event.usEmail;
        prepared.description = event.usDescription;
        prepared.fromDate = start[0];
        prepared.toDate = dateTo[0];
        return prepared;
    };
    return {
        getFormMessage: function (event) {
            var html = '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                    '<ul><li><b>Start: </b>' + event.start.format() + '</li>' +
                    '<li><b>End: </b>' + ($.isEmptyObject(event.end) ? '' : event.end.format()) + '</li>' +
                    '<li><b>Subject: </b><br><textarea>' + event.usDescription + '</textarea></li></ul>' +
                    '</div>  </div>';
            return html;
        },
        getFormButtons: function (event) {
            var buttons = {
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {
                        $.ajax({
                            url: urls.manage,
                            type: 'post',
                            dataType: 'json',
                            data: {'action': 'save', 'event': prepareEvent(event)},
                            success: function (data) {
                                if (data.type == 'success') {
                                    event.id = data.eventId;
                                    event.backgroundColor = 'green';
                                    Calendar.getHtmlObject().fullCalendar('renderEvent', event, true);
                                } else {
                                    alert(data.message);
                                }
                            }
                        });
                    },
                },
                cansel: {
                    label: "Cancel",
                    className: "btn-info",
                },
                delete: {
                    label: "Delete",
                    className: "btn-danger",
                    callback: function () {
                        if (typeof event.id == 'number') {
                            $.ajax({
                                url: urls.manage,
                                type: 'post',
                                dataType: 'json',
                                data: {'action': 'delete', 'id': event.id},
                                success: function (data) {
                                    if (data.type == 'success') {
                                        $('#calendar').fullCalendar('removeEvents', event.id);
                                    } else {
                                        alert(data.message);
                                    }
                                }
                            });
                        } else {
                            Calendar.getHtmlObject().fullCalendar('removeEvents', event.id);
                        }
                    }
                },
            };
            return buttons;
        },
    };
}();

var Calendar = function () {

    var myCalendar = $('#calendar');

    var defaultTimeList = function () {
        var start = moment('2010-11-01').hour(8);
        var end = moment('2010-11-01').hour(20);
        var listTime = [];
        while (start <= end) {
            listTime.push(start.format('HH:mm'));
            start.add(30, 'm');
        }
        return listTime;
    };

    var generateRadioBlock = function (oMoment, ev) {

        var html = '<div class="col-md-9"><div class="radio-list">';
        var listTime = Settings.getScheduleByDate(oMoment);
        if (!listTime || listTime.length == 0) {
            listTime = Settings.getFreeTimeByDate(oMoment);
            if (!listTime || listTime.length == 0) {
                listTime = defaultTimeList();
            }
        }
        for (i = 0; i < listTime.length; i++) {
            html += '<label><div><span><input type="radio" name="hours[]" value="' + listTime[i] + '" ';
            if (ev && listTime[i] == ev.start.format('HH:mm')) {
                html += ' checked';
            }
            html += '></span> ' + listTime[i] + '</div></label>';
        }
        html += '</div></div>';
        return html;
    };

    var calendarOptions = {
        defaultView: 'month', // change default view with available options from http://arshaw.com/fullcalendar/docs/views/Available_Views/ 
        slotMinutes: 15,
        editable: true,
        weekends: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!

        minTime: '08:00',
        maxTime: '20:00',
        drop: function (date, allDay) { // this function is called when something is dropped
            if (Settings.isBind(date) || date <= moment()) {
                return;
            }
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');
            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);
            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            copiedEventObject.className = $(this).attr("data-class");
            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            myCalendar.fullCalendar('renderEvent', copiedEventObject, true);

            $(this).remove();
        },
        timeFormat: 'HH:mm',
        axisFormat: 'HH:mm',
        dayClick: function (date, jsEvent, view) {
            if (date > moment()) {
                myCalendar.fullCalendar('gotoDate', date);
                myCalendar.fullCalendar('changeView', 'agendaDay');
            } else {
                alert('You can\'t sign up to this date.');
            }
        },
        eventClick: function (event, jsEvent, view) {
            if (event.usStatus == 'new') {
                bootbox.dialog({
                    title: 'Your new order is "' + event.title + '"',
                    message: myAlerts.getFormMessage(event),
                    buttons: myAlerts.getFormButtons(event),
                });
            } else {
                var html
                        = '<h3>Your order:</h3>'
                        + '<ul><li><b>Title: </b>'
                        + event.title + '</li>'
                        + '<li><b>Start: </b>'
                        + event.start.format() + '</li>'
                        + '<li><b>End: </b>'
                        + ($.isEmptyObject(event.end) ? '' : event.end.format()) + '</li>';
                if (event.usStatus) {
                    html += '<li><b>Status: </b>' + event.usStatus + '</li>';
                }
                html += '</ul>';
                bootbox.alert(html);
            }
        },
        viewRender: function (view, element) {
            if (view.start <= moment()) {
                myCalendar.find('button.fc-prev-button').hide();
            } else {
                myCalendar.find('button.fc-prev-button').show();
            }
            if (view.name == 'month') {
                //myCalendar.find('div.fc-right').show();
                $('div.fc-bg td.fc-day').each(function () {
                    var oMoment = moment($(this).data('date'));
                    if (Settings.isBind(oMoment) || oMoment < moment().hour(0).minute(0)) {
                        $(this).css('background-color', '#DCDCDC');
                    }
                });
            } else {
                var event = myCalendar.fullCalendar('clientEvents', function (event) {
                    if (event.start.format('YYYY-MM-DD') == view.start.format('YYYY-MM-DD')) {
                        return true;
                    } else {
                        return false;
                    }
                });

                var html = generateRadioBlock(view.start, event[0]);
                myCalendar.find('div.fc-view').html(html);
                if (event[0]) {
                    //myCalendar.find('div.fc-right').css('display', 'none');
                    $('input[name ^= "hours"]').on('change', {'event': event[0]}, function (e) {
                        var start = this.value;
                        var ev = e.data.event;
                        var evStart = ev.start.format().split('T');
                        ev.start = moment(evStart[0] + 'T' + start);
                        myCalendar.fullCalendar('updateEvent', ev);
                        $('button.fc-month-button').click();
                    });
                } else {
                    //myCalendar.find('div.fc-right').show();
                    $('input[name ^= "hours"]').attr('disabled', 'disabled');
                }
            }
        },
        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
            if (Settings.isBind(event.start) || event.start <= moment()) {
                revertFunc();
            }

        },
    };

    return {
        //main function to initiate the module
        init: function () {
            Calendar.initCalendar();
        },
        getHtmlObject: function () {
            return myCalendar;
        },
        getOptions: function (params) {
            if (!params) {
                params = {};
            }
            params.header = Calendar.initHeader();
            $.extend(calendarOptions, params);
            return calendarOptions;
        },
        initHeader: function () {

            var h = {};

            if (Metronic.isRTL()) {
                if (myCalendar.parents(".portlet").width() <= 720) {
                    myCalendar.addClass("mobile");
                    h = {
                        right: 'title, prev, next',
                        center: '',
                        left: 'month, today'
                    };
                } else {
                    myCalendar.removeClass("mobile");
                    h = {
                        right: 'title',
                        center: '',
                        left: 'month, today, prev,next'
                    };
                }
            } else {
                if (myCalendar.parents(".portlet").width() <= 720) {
                    myCalendar.addClass("mobile");
                    h = {
                        left: 'title, prev, next',
                        center: '',
                        right: 'today, month'
                    };
                } else {
                    myCalendar.removeClass("mobile");
                    h = {
                        left: 'title',
                        center: '',
                        right: 'prev, next, today, month'
                    };
                }
            }
            return h;
        },
        initCalendar: function () {

            if (!jQuery().fullCalendar) {
                return;
            }

            var initDrag = function (el) {
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    id: 'new' + moment().format(),
                    title: $.trim(el.text()),
                    usDescription: el.data('subject'),
                    usName: el.data('name'),
                    usEmail: el.data('email'),
                    usStatus: 'new',
                };
                // store the Event Object in the DOM element so we can get to it later
                el.data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                el.draggable({
                    zIndex: 999,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0 //  original position after the drag
                });
            };

            var addEvent = function (title, email, subgect) {

                var html = $('<div data-subject="' + subgect + '" '
                        + ' data-name="' + title + '" '
                        + ' data-email="' + email + '" '
                        + ' class="external-event label label-default">New order</div>');
                jQuery('#event_box').append(html);
                initDrag(html);
            };

            $('#external-events div.external-event').each(function () {
                initDrag($(this));
            });

            $('#order_valid').submit(function () {
                if ($(this).validate().valid()) {
                    var title = $('#user_name').val();
                    var email = $('#user_email').val();
                    var subgect = $('#event_subject').val();
                    addEvent(title, email, subgect);
                }
                return false;
            });

            myCalendar.fullCalendar('destroy'); // destroy the calendar
            var calendar = myCalendar.fullCalendar(Calendar.getOptions());

        }

    };
}();
