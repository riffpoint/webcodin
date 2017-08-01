(function ($, Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.imgparagraph = {
    attach: function (context, settings) {
      var accordeon = {
        content: null,
        headers: null,
        imageContainer: null,
        init: function () {
          this.content = $('.accordeon-content')
          this.headers = $('.accordeon-header')
          this.imageContainer = $('.accordeon-image-placeholder')
          this.hideContent()
          this.moveImages()
          this.attachEvent()
        },
        hideContent: function () {
          this.content.hide()
        },
        moveImages: function() {
          var images = $('.field--name-field-accordeon-image', this.content),
          accordeon = this
          images.each(function(){
            var id = accordeon.getParagraphId(this);
            $(this).attr('data-paragraph-id', id)
            $(this).hide()
            accordeon.imageContainer.append(this)
          })
        },
        hideOpened: function () {
           var accordeonContent = $(this.content)
           accordeonContent.each(function(){
             if ($(this).is(':visible')) {
               var header = $(this).prev()
               header.removeClass('item-open')
               $(this).slideToggle('fast')
             }
           })
        },
        attachEvent: function() {
          var titles = $(this.headers),
          accordeon = this
          titles.each(function () {
            $(this).unbind('click').click(function(){
              accordeon.hideOpened()
              accordeon.hideImage()
              $(this).addClass('item-open');
              var id = $('.field--name-field-accordeon-title',this).attr('data-paragraph-id')
              var currentContent = $(this).next('.accordeon-content')
              currentContent.slideToggle('fast')
              accordeon.showImage(id);
            })
          });
        },
        hideImage: function (){
          var images = $(this.imageContainer).find('.field--name-field-accordeon-image');
          images.each(function() {
            if ($(this).is(':visible')) {
              $(this).slideToggle('fast');
            }
          })
        },
        showImage: function (id) {
          var parId = id,
          image = $(this.imageContainer).find('.field--name-field-accordeon-image').filter(function(idx, elem){
            return ($(elem).attr('data-paragraph-id') == parId)
          })
          $(image).slideToggle('fast')
        },
        getParagraphId: function(elem){
          var accHeader = $(elem).closest('.accordeon-content').prev(),
          title = $(accHeader).find('.field--name-field-accordeon-title'),
          id = $(title).attr('data-paragraph-id')
          return id;
        }
      };
      accordeon.init()
    }
  }
  
})(jQuery, Drupal, drupalSettings)