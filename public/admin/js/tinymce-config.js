tinymce.init({
    selector: 'textarea.textarea-mce',
    plugins: 'lists link image table code help wordcount',
    toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image table | code help',
    height: 400,

    // Xử lý upload ảnh từ thiết bị
    images_upload_handler: function (blobInfo, success, failure) {
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
  
        fetch('/upload-image', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          success(data.url); // Trả về URL ảnh Cloudinary
        })
        .catch(err => {
          failure('Upload thất bại: ' + err.message);
        });
      }
  });