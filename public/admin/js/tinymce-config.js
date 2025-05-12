tinymce.init({
  selector: 'textarea.textarea-mce',
  plugins: 'lists link image table code help wordcount',
  toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image table | code help',
  height: 400,

  file_picker_types: 'image',

  // Upload ảnh lên Cloudinary thông qua server
  images_upload_handler: function (blobInfo, success, failure) {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    fetch('/upload', { // backend route bạn đã cấu hình
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      success(data.location); // Trả về URL ảnh từ Cloudinary
    })
    .catch(err => {
      failure('Lỗi upload ảnh: ' + err.message);
    });
  },

  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});