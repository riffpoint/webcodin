$(document).ready(function () {

    var downloadMulti = $('#multipleDownload');
    var deleteMulti = $('#multipleDelete');
    var managerSelector = $('#admin_custom_user_exhibitor_form_exhibitorProfileUser_managerId');
    var siteManager = $('#admin_user_exhibitor_sitemanager_form_user').select2();
    var comment = $('textarea[id="comment"]');
    var uploadFileName = $('#fileName');
    var uploadErrorMsg = $('#uploadErrors');
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    var deleteid;
    var managerName = $('#managerName');
    var additionalFieldDetails = $('#admin_custom_user_exhibitor_form_exhibitorProfileUser_exhibitorCompany_additional');
    var additionalFieldRoot = $('#admin_custom_user_exhibitor_form_additional');
    var websiteDetails = $('#admin_custom_user_exhibitor_form_exhibitorProfileUser_exhibitorCompany_website');
    var websiteRootUser = $('#admin_custom_user_exhibitor_form_website');
    var detailsFile = $('#admin_custom_user_exhibitor_form_file');
    var rootFile = $('#admin_custom_user_exhibitor_form_exhibitorProfileUser_file');
    var newDetails = $('#newDetails');
    var newRoot = $('#newRoot');
    var docUpload = $('#documentupload');

    downloadMulti.attr('disabled', 'disabled');
    deleteMulti.attr('disabled', 'disabled');
    managerSelector.val($('#managerName').attr('data-id'));
    siteManager.select2("val", $('#managerName').attr('data-id'));

    if(localStorage.getItem('new') != null){
        if($('.col-md-12').children().hasClass("alert-success")){
            $('.nav-tabs a').eq(2).tab('show');
            localStorage.removeItem('new');
        } else {
            siteManager.select2("val", localStorage.getItem("new"));
            managerName.text(siteManager.select2("data")[0].text);
            managerSelector.val(siteManager.select2("data")[0].id);
            managerName
                .attr('data-id', localStorage.getItem("new"))
                .attr("href", "/admin/users/site-managers/" + siteManager.select2("data")[0].id + "/edit");
        }
    }

    $(document).on("click", "a.download", function (e) {
        $.fileDownload($(this).attr("href"));
        return false;
    });

    $(document).on('nested:fieldRemoved', function (event) {
        $('[required]', event.field).removeAttr('required');
    });

    $('body').on('ifChanged', 'input[type="checkbox"]', function() {
        var testCheckboxes = [];
        var len = findCheckedRows(testCheckboxes);
        if(len.length){
            downloadMulti.removeAttr('disabled', 'disabled');
            deleteMulti.removeAttr('disabled', 'disabled');
        } else {
            downloadMulti.attr('disabled', 'disabled');
            deleteMulti.attr('disabled', 'disabled');
        }
    });

    $('body').on('ifChanged', '#mainCheckbox', function(){
        $(this)
            .closest('table')
            .find('td.sonata-ba-list-field-batch input[type="checkbox"]')
            .iCheck($(this).is(':checked') ? 'check' : 'uncheck')
        ;
    });

    $('body').on('click', '[href="#addNewFile"]', function(){
        $('#status, .percent').empty();
        $('.bar').css('width', '0%');
    });

    $('body').on('click', '[href="#popup-deletefile"]', function(){
        deleteid = $(this).attr("id");
    });

    $("body").on('click', 'a[name="delete"]', function () {
        deleteUploadedImage(deleteid);
        $.fancybox.close();
    });

    $("body").on('click', '#multipleDownload', function(e){
        e.preventDefault();
        var toDonwloads = [];
        var data = {
            user: getUserId(),
            ids: JSON.stringify(findCheckedRows(toDonwloads))
        };

        $.fileDownload($(this).attr("href"),{
            httpMethod: "POST",
            data: data
        });

        $('input').iCheck('uncheck');

        return false;
    });

    $("body").on('click', '#mRemove', function(){
        var toDelete = [];
        var elems = findCheckedRows(toDelete);
        if(elems.length){
            deleteUploadedImage(elems);
            $.fancybox.close();
        } else {
            $.fancybox.close();
        }
        downloadMulti.attr('disabled', 'disabled');
        deleteMulti.attr('disabled', 'disabled');
    });

    $('#select').on('click', function (e) {
        var notFilled = false;
        var select2ManagerDate = siteManager.select2('data')[0];

        if(select2ManagerDate.text == ""){
            $("#managerError").removeClass('hidden');
            var notFilled = true;
        }

        if (managerSelector.val() != "") {
            $("#managerError").addClass('hidden');
        }

        managerName.text(select2ManagerDate.text);
        managerName.attr("data-id", select2ManagerDate.id);
        managerSelector.val(managerName.attr('data-id'));

        if(managerName.attr("href") != ""){
            var url = managerName.attr("href");
            var id = url.split("/");
            var newUrl = url.replace(id[id.length - 2 ], select2ManagerDate.id);
            managerName.attr("href", newUrl);
        } else {
            managerName.attr("href", "/admin/users/site-managers/" + select2ManagerDate.id + "/edit");
        }

        if(!notFilled){
            $.fancybox.close();
        }
    });

    siteManager.on('change', function(){
        $("#managerError").addClass('hidden');
    });

    $('#replace').find('#close').on('click', function(){
        managerSelector.val("");
        siteManager.select2("val", "");
        $("#managerError").addClass('hidden');
        if(getUserId() == "exhibitors"){
            managerName.text("");
        }
        $.fancybox.close();
    });

    $('#addNewFile #close').on("click", function(){
        $('#comment').val('');
        $('#uploadErrors, #fileName').text('');
        docUpload.replaceWith( docUpload = docUpload.clone(true));
    });

    docUpload.fileupload({
        url: "/upload-document",
        dataType: 'json',
        autoUpload: true,
        limitConcurrentUploads: 1,
        maxChunkSize: 50000000,
        maxNumberOfFiles: 1,
        sequentialUploads: true,
        add: function (e, data) {

            var error = false;
            var docName = data.files[0].name;
            var uploadErrors = [];
            var acceptFileTypes = /^application\/(pdf|msword|doc|docx|vnd.openxmlformats-officedocument.wordprocessingml.document)/i;
            var acceptImagesFileTypes = /^image\/(jpe?g|png)$/i;

            var percentVal = '0%';
            status.empty();
            comment.val('');
            bar.width(percentVal);
            percent.html(percentVal);
            uploadFileName.text(docName);
            uploadErrorMsg.text('');

            if (!acceptFileTypes.test(data.originalFiles[0]['type']) && !acceptImagesFileTypes.test(data.originalFiles[0]['type'])) {
                uploadErrors.push('Not an accepted file type');
            }
            if (acceptFileTypes.test(data.originalFiles[0]['type']) && data.originalFiles[0]['size'] > 50000000) {
                uploadErrors.push("Filesize is too big. Maximum upload size 50М");
            }

            if (acceptImagesFileTypes.test(data.originalFiles[0]['type']) && data.originalFiles[0]['size'] > 50000000) {
                uploadErrors.push("Filesize is too big. Maximum upload size 50М");
            }

            if (checkUploadedDocNameIsDuplicated(docName, getUserId())) {
                uploadErrors.push('File with the same name is exist. Please change name of file and try upload again.');
            }

            if (uploadErrors.length > 0) {
                uploadErrorMsg.text(uploadErrors.join("\n"));
                data.files[0] = null;
                $('#add').off("click");
                error = true;
            } else {

                var jqXHR;

                $('#add').off("click").on("click", function(e, perce){

                    jqXHR = data.submit();

                    if(uploadErrors.length){
                        error = true;
                    }

                    if(comment.val() == ""){
                        comment.focus();
                        error = true;
                    } else {
                        error = false;
                    }

                    if(!error && data.files[0] != null) {
                        data.submit();
                    }
                });

                $('#addNewFile #close').on("click", function(e){
                    $('#documentupload').prop("disabled", false);
                    var percentVal = '0%';
                    status.empty();
                    comment.val('');
                    bar.width(percentVal);
                    percent.html(percentVal);
                    uploadFileName.text('');
                    uploadErrorMsg.text('');
                    data.files[0] = null;
                    jqXHR.abort();

                });
            }
        },
        done: function (e, data) {
            if (!data.result.error) {
                var file = data.result.file;
                $('#fileUploadTbl').append(uploadedTemplate(file.id, file.docName, file.docComment, file.docAddedBy, file.docAddedDate));
                uploadFileName.text('');
                uploadErrorMsg.text('');
                comment.val('');
                status.html('Uploded: ' + data.total / 1000000 + ' MB');
                $('#documentupload').prop("disabled", false);
                data.files[0] = null;
                $.fancybox.close();
            }
        }
    }).bind('fileuploadprogress', function (e, data) {
        $('#documentupload').prop("disabled", true);
        var progress = parseInt(data.loaded / data.total * 100, 10);
        var percentVal = progress + '%';
        bar.width(percentVal);
        percent.html(percentVal);
    }).bind('fileuploadsubmit', function (e, data) {
        data.formData = {
            comment: comment.val(),
            id: getUserId()
        }
    });

    $('body').on('blur', '#admin_custom_user_exhibitor_form_exhibitorProfileUser_exhibitorCompany_website', function(){
        if(websiteDetails.val() == "" || validateFieldsForUrlLinks(websiteDetails.val())){
            $('.website').eq(0).addClass('hidden');
            $(this).removeClass('border-color-error');
        }
    });

    $('body').on('blur', '#admin_custom_user_exhibitor_form_website', function(){
        if(websiteRootUser.val() == "" || validateFieldsForUrlLinks(websiteRootUser.val())){
            $('.website').eq(1).addClass('hidden');
            $(this).removeClass('border-color-error');
        }
    });

    additionalFieldDetails.blur(function(){
        if(additionalFieldDetails.val() == "" || !validateFieldsForUrlLinks(additionalFieldDetails.val())){
            $('.additional').eq(0).addClass('hidden');
            $(this).removeClass('border-color-error');
        }
    });

    additionalFieldRoot.blur(function(){
        if(additionalFieldRoot.val() == "" || !validateFieldsForUrlLinks(additionalFieldRoot.val())){
            $('.additional').eq(1).addClass('hidden');
            $(this).removeClass('border-color-error');
        }
    });

    detailsFile.on('change', function(){
        imageFileValidation($(this), $('#errors-details'));
    });

    rootFile.on('change', function(){
        imageFileValidation($(this), $('#errors-root'));
    });


    $('#resetDetails').on("click", function(){
        newDetails.empty().append("<img src='http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image'/>");
        $('#errors-details').empty();
        userResetProfileImage(getUserId());
    });

    $('#resetRoot').on("click", function(){
        newRoot.empty().append("<img src='http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image'/>");
        $('#errors-root').empty();
        userResetProfileImage(getUserId(), true);
    });

    $('button[type="submit"]').on('click', function (e) {

        var submitError = false;
        $('.additional, .website').addClass('hidden');
        $('textarea[id*="additional"], input[type="text"]').removeClass('border-color-error');

        if(websiteDetails.val() != "" && !validateFieldsForUrlLinks(websiteDetails.val())){
            submitError = true;
            showErrorValidationUrl(websiteDetails, '.website', 0);
        }

        if(websiteRootUser.val() != "" && !validateFieldsForUrlLinks(websiteRootUser.val())){
            submitError = true;
            showErrorValidationUrl(websiteRootUser, '.website', 1);
        }

        if(validateFieldsForUrlLinks(additionalFieldDetails.val())){
            submitError = true;
            showErrorValidationUrl(additionalFieldDetails, '.additional', 0);
        }

        if(validateFieldsForUrlLinks(additionalFieldRoot.val())){
            submitError = true;
            showErrorValidationUrl(additionalFieldRoot, '.additional', 1);
        }

        if (managerSelector.val() == "") {
            if(managerName.attr("data-id") != ""){
                managerSelector.val(managerName.attr("data-id"));
            } else {
                $("#managerError").removeClass('hidden');
                $('#siteManager').trigger('click');
                submitError = true;
            }
        }

        if(submitError){
            e.preventDefault();
        }

    });

    $('[name="btn_create_and_edit"]').on("click", function(){
        localStorage.setItem("new", managerName.attr('data-id'));
    });
});

function uploadedTemplate(id, fileName, fileUploadComment, fileUploadedBy, fileUploadDate) {
    var template = "<tr id='" + id + "'>" +
        "<td class='sonata-ba-list-field sonata-ba-list-field-batch'>" +
        "<input type='checkbox' object-id='" + id + "'>" +
        "</td>" +
        "<td>" + id + "</td>" +
        "<td>" + fileName + "</td>" +
        "<td>" + fileUploadComment + "</td>" +
        "<td>" + fileUploadedBy + "</td>" +
        "<td>" + fileUploadDate + "</td>" +
        "<td> " +
        "<div class='btn-group'> " +
        "<a class='btn btn-sm btn-default download' name='upload' href='/exhibitor-download-file/" + id + "'><i class='fa fa-plus-circle'></i>&nbsp;Download</a>" +
        "<a class='btn btn-sm btn-default popup-open' id='" + id + "' href='#popup-deletefile'><i class='fa fa-minus-circle'></i>&nbsp;Delete</a>" +
        "</div>"+
        "</td>" +
        "</tr>";

    return template;
}

function makeRotTabActive() {
    $('.nav-tabs a').eq(1).tab('show');
}

function deleteUploadedImage(ids) {

    if(typeof ids == "string"){
        var data = {
            id: ids
        };
        var flag = true;
    } else {
        var data = {
            id: JSON.stringify(ids)
        };
    }

    $.ajax({
        url: "/delete-uploaded-file",
        method: 'post',
        data: data,
        success: function (data) {
            if (!data.error) {
                if(flag){
                    $('#fileUploadTbl tr[id = "' + ids + '"]').remove();
                } else {
                    for(var i = 0; i < ids.length; i++){
                        $('#fileUploadTbl tr[id = "' + ids[i] + '"]').remove();
                    }
                }
                $('input').iCheck('uncheck');
            }
        },
        fail: function(){}
    });
}

function findCheckedRows(selected){

    $('input:checked').each(function() {
        selected.push($(this).attr('object-id'));
    });

    return selected;
}

function checkUploadedDocNameIsDuplicated(fileName, userId){

    var fileExists = false;

    var data = {
        fileName: fileName,
        userId: userId
    };

    $.ajax({
        url: "/check-user-upload-doc-name",
        method: "POST",
        data: data,
        async: false,
        success: function(data){
            fileExists = data.exists;
        },
        fail: function(){}
    });

    return fileExists;
}