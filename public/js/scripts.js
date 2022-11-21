(function() {
	const $inputs = $('input');
	const $textarea = $('textarea');
	const $button = $('button');
	const $mailListCheckbox = $('#mailing-list-checkbox');


	/***** Disable all form controls. Will enable after form is completely drawn. *****/
	$inputs.prop('disabled', true);
	$textarea.prop('disabled', true);
	$button.prop('disabled', true);


	/********** Create Vivus Objects **********/
	function createVivusObject(svg) {
		var vivusObject = new Vivus(svg, {
			start: 'manual',
	   	duration: 200,
		  type: 'oneByOne',
		  animTimingFunction: Vivus.EASE
			}
		);
		return vivusObject;
	}
	
	const contactUs = createVivusObject('contact-us-svg');
	const pencil = createVivusObject('pencil-svg');
	const nameTextBox = createVivusObject('name-text-box-svg');
	const emailTextBox = createVivusObject('email-text-box-svg');
	const mailingListCheckbox = createVivusObject('mailing-list-checkbox-svg');
	const mailingListCheckmark = createVivusObject('mailing-list-checkmark-svg');
	const subjectTextBox = createVivusObject('subject-text-box-svg');
	const messageTextarea = createVivusObject('message-textarea-svg');
	const sendButton = createVivusObject('send-button-svg');


	/********************************************************************
	Draw the form and then enable it.
	I have created a "promisfied" version of the play method provided by
	the Vivus	class.
	*********************************************************************/
	function promisfiedPlay(rate) {
		return new Promise(resolve => {
			Vivus.prototype.play.call(this, rate, resolve)
		});
	};

	promisfiedPlay.call(contactUs, 0.7)
		.then(() => promisfiedPlay.call(pencil, 1.1))
		.then(() => promisfiedPlay.call(nameTextBox, 2.7))
		.then(() => promisfiedPlay.call(emailTextBox, 2.7))
		.then(() => promisfiedPlay.call(mailingListCheckbox, 6))
		.then(() => promisfiedPlay.call(subjectTextBox, 2.7))
		.then(() => promisfiedPlay.call(messageTextarea, 1.9))
		.then(() => promisfiedPlay.call(sendButton, 1.2))
		.then(() => {
			$('label').addClass('shown');
			$('svg').addClass('drawn');
			$mailListCheckbox.prop('checked', false);
			$inputs.prop('disabled', false);
			$textarea.prop('disabled', false);
			$button.prop('disabled', false);
		})
		.catch(() => console.log("An Error Occured."));


	/********** Checkmark Animation **********/
	$mailListCheckbox.on('change', () => {
		if ($mailListCheckbox.prop('checked')) {
			mailingListCheckmark.play(4);
		} else {
			mailingListCheckmark.stop().reset();
		}
	});


	/*****************************************************************************
	************************** Form Validation Code ******************************
	*****************************************************************************/

	const validator = new FormValidator('contact-us-form', [{
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
	}], errors => {
	  		if (errors.length > 0) {
					var errorString = '';
	        for (let i = 0, errorLength = errors.length; i < errorLength; i++) {
	            errorString += errors[i].message + '\n';
	        }

					errors.forEach(error => {
						if (error.id === 'email-text-box' && error.rule === 'valid_email') {
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

	$('#name-text-box').on('focus', () => {
		$('#name-text-box-svg').removeClass('invalid');
		$('#name-required-text').hide();
	});

	$('#email-text-box').on('focus', () => {
		$('#email-text-box-svg').removeClass('invalid');
		$('#email-required-text').hide();
		$('#invalid-email-text').hide();
	});

	$('#subject-text-box').on('focus', () => {
		$('#subject-text-box-svg').removeClass('invalid');
		$('#subject-required-text').hide();
	});

	$('#message-textarea').on('focus', () => {
		$('#message-textarea-svg').removeClass('invalid');
		$('#message-required-text').hide();
	});
})();
