
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

	emailjs.init("7b2pjJZnyl-lFbWNb");

    jQuery('#template-contactform').on('submit', function( e ){

		e.preventDefault();
		var $form = jQuery(this);

		// jQuery($form).find('span.contact-form-respond').remove();


		t = setTimeout(()=>{

			//if one of form fields is empty - exit
			console.log($form.find('.form-control.error'))
			if ($form.find('input[aria-invalid="true"]').length > 0) {
				return;
			}
			// request["site"] = "arjt.co";
			var template_params = {
				"site": "arjt.io",
				"name": $("#template-contactform-name").val(),
				"email": $("#template-contactform-email").val(),
				"subject": $("#template-contactform-subject").val(),
				"message": $("#template-contactform-message").val()
			}
			var service_id = "mail_ru";
			var template_id = "template_na9qqtl";

			emailjs.send(service_id, template_id, template_params).then(function (response) {
				console.log('SUCCESS!', response.status, response.text);
				alert("Message was send");
				$(".form-process").hide();

			}, function (error) {
				// $(".lawfirm-inline-loader").hide();
				jQuery($form).find('[type="submit"]').attr('disabled', false).parent().append('<span class="contact-form-respond highlight">'+ error +'</span>');
				$(".form-process").hide()
				console.log('FAILED...', error);
			});
		}, 200)


	});


});
