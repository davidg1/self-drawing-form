// Place code in an IIFE to not pollute the global space
(function() {

	var $inputs = $('input');
	var $textarea = $('textarea');
	var $button = $('button');
	var $mailListCheckbox = $('#mailing-list-checkbox');


	/***** Disable all form controls. Will enable after form is completely drawn. *****/
	$inputs.prop('disabled', true);
	$textarea.prop('disabled', true);
	$button.prop('disabled', true);


	/********** Create Vivus Objects **********/
	var contactUs = createVivusObject('contact-us-svg', 200);
	var pencil = createVivusObject('pencil-svg', 200);
	var nameTextBox = createVivusObject('name-text-box-svg', 200);
	var emailTextBox = createVivusObject('email-text-box-svg', 200);
	var mailingListCheckbox = createVivusObject('mailing-list-checkbox-svg', 200);
	var mailingListCheckmark = createVivusObject('mailing-list-checkmark-svg', 200);
	var subjectTextBox = createVivusObject('subject-text-box-svg', 200);
	var messageTextarea = createVivusObject('message-textarea-svg', 200);
	var sendButton = createVivusObject('send-button-svg', 200);

	function createVivusObject(svg, duration) {
		var vivusObject = new Vivus(svg, {
			start: 'manual',
	   	duration: duration,
		  type: 'oneByOne',
		  animTimingFunction: Vivus.EASE
			}
		);
		return vivusObject;
	}


	/********************************************************************
	Draw the form and then enable it.
	To avoid callback "hell" I am using the Bluebird Promise Library.
	I have created a "promisfied" version of the play() method provided by
	the Vivus	class.
	*********************************************************************/
	function promisfiedPlay(rate) {
		self = this;
		return new Promise(function (resolve, reject) {
			Vivus.prototype.play.call(self, rate, resolve)
		});
	};

	promisfiedPlay.call(contactUs, 0.25)
		.then(function () {
			return promisfiedPlay.call(pencil, 0.8)
		})
		.then(function () {
			return promisfiedPlay.call(nameTextBox, 1.5)
		})
		.then(function () {
			return promisfiedPlay.call(emailTextBox, 1.5)
		})
		.then(function () {
			return promisfiedPlay.call(mailingListCheckbox, 3)
		})
		.then(function () {
			return promisfiedPlay.call(subjectTextBox, 1.5)
		})
		.then(function () {
			return promisfiedPlay.call(messageTextarea, 1.2)
		})
		.then(function () {
			return promisfiedPlay.call(sendButton, 0.6)
		})
		.then(function(){
			$('label').addClass('shown');
			$('svg').addClass('drawn');
			$mailListCheckbox.prop('checked', false);
			$inputs.prop('disabled', false);
			$textarea.prop('disabled', false);
			$button.prop('disabled', false);
		})
		.catch(function () {
			console.log("An Error Occured.");
		});



	/********** Checkmark Animation **********/
	$mailListCheckbox.on('change', function () {
		if ($mailListCheckbox.prop('checked')) {
			mailingListCheckmark.play(4);
		} else {
			mailingListCheckmark.stop().reset();
		}
	});



	/*****************************************************************************
	************************** Form Validation Code ******************************
	*****************************************************************************/

	var validator = new FormValidator('contact-us-form', [{
		name: 'name',
		rules: 'required'
	}, {
		name: 'email',
		rules: 'required|valid_email'
	}, {
		name: 'subject',
    rules: 'required'
	}, {
		name: 'message',
    rules: 'required'
	}], function (errors, event) {
	  		if (errors.length > 0) {
					var errorString = '';
	        for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
	            errorString += errors[i].message + '\n';
	        }
					console.log(errorString);

					errors.forEach(function(error){
						if(error.id === 'email-text-box' && error.rule === 'valid_email'){
							$('#email-text-box-svg').addClass('invalid');
							$('#invalid-email-text').show();
						} else {
							$('#' + error.id + '-svg').addClass('invalid');
							$('#' + error.name + '-required-text').show();
						}
					});
				}
  		}
	);

	$('#name-text-box').on('focus', function () {
		$('#name-text-box-svg').removeClass('invalid');
		$('#name-required-text').hide();
	});

	$('#email-text-box').on('focus', function () {
		$('#email-text-box-svg').removeClass('invalid');
		$('#email-required-text').hide();
		$('#invalid-email-text').hide();
	});

	$('#subject-text-box').on('focus', function () {
		$('#subject-text-box-svg').removeClass('invalid');
		$('#subject-required-text').hide();
	});

	$('#message-textarea').on('focus', function () {
		$('#message-textarea-svg').removeClass('invalid');
		$('#message-required-text').hide();
	});
})();
