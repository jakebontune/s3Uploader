document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	console.log("JOE: device ready");
 //    var policy = {
 //        "expiration": "2020-12-31T12:00:00.000Z",
 //        "conditions": [
 //            {"bucket": "myavana"},
 //            ["starts-with", "$key", ""],
 //            {"acl": 'public-read'},
 //            ["starts-with", "$Content-Type", ""],
 //            ["content-length-range", 0, 9942880000]
 //        ]
 //    };
	// var policyBase64 = window.btoa(JSON.stringify(policy));
 //    var signature = CryptoJS.HmacSHA1(policyBase64, "AKIAII7DPSMBSH6CJT3Q");
    
	// console.log ("SIGNATURE: " + signature);

	var $img = $('.user-img'),

    // Take a picture using the camera
    takePicture = function (e) {
        var options = {
            quality: 75,
            targetWidth: 1000,
            targetHeight: 1000,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    	};

    	navigator.camera.getPicture(
            function (imageURI) {
                $img.attr('src', imageURI);
                var fileName = "" + (new Date()).getTime() + ".jpg"; // consider a more reliable way to generate unique ids
                s3Uploader.upload(imageURI, fileName)
                    .done(function () {
                        alert("S3 upload succeeded");
                    })
                    .fail(function () {
                        alert("S3 upload failed");
                    });
            },
            function (message) {
                // We typically get here because the use canceled the photo operation. Fail silently.
                console.log("take photo canceled");
            }, options);

        return false;

    };

    $(".cameraButton").on("click", takePicture);
}