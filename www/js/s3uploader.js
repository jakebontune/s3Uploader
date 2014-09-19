var s3Uploader = (function () {

    var policy = {
        "expiration": "2020-12-31T12:00:00.000Z",
        "conditions": [
            {"bucket": "myavana"},
            ["starts-with", "$key", ""],
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 9942880000]
        ]
    };

    var s3URI = encodeURI("http://myavana.s3.amazonaws.com/"),
        policyBase64 = window.btoa(JSON.stringify(policy)),
        signature = CryptoJS.HmacSHA1(policyBase64, "AKIAII7DPSMBSH6CJT3Q"),
        awsKey = 'AKIAII7DPSMBSH6CJT3Q',
        acl = "public-read";

    function upload(imageURI, fileName) {
        console.log("uploading");
        var deferred = $.Deferred(),
            ft = new FileTransfer(),
            options = new FileUploadOptions();

        options.params = {
            "signature": signature,
            "key": fileName,
            "AWSAccessKeyId": awsKey,
            "acl": acl,
            "Content-Type": "image/jpeg",
            "policy": policyBase64
        };
        options.fileKey = "file";
        options.fileName = fileName;
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.httpMethod = "POST";

        ft.upload(imageURI, s3URI,
            function (e) {
                deferred.resolve(e);
            },
            function (e) {
                deferred.reject(e);
            }, options);

        return deferred.promise();

    }

    return {
        upload: upload
    }

}());