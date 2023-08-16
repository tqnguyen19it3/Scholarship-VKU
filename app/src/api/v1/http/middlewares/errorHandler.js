function errorHandler(err, req, res, next) {
  // Trả về một thông báo lỗi cho client
  // res.json({
  //     status: err.status || 500,
  //     message: err.message,
  // });

  const statusCode = err.status || 500;
  const errorMessage = err.message;
  let message = "Chúng tôi tự động theo dõi các lỗi này, nhưng nếu sự cố vẫn tiếp diễn, vui lòng liên hệ với chúng tôi. Trong khi chờ đợi, hãy thử làm mới.";

  if (statusCode === 401) {

    message = "Bạn không có quyền! Cần có xác thực đầy đủ để truy cập tài nguyên này.";
    return res.status(statusCode).render('errors/error', { layout: 'errors/error', statusCode, errorMessage, message });

  } else if (statusCode === 403) {

    message = "Bạn không có quyền! Cần có xác thực đầy đủ để truy cập tài nguyên này.";
    return res.status(statusCode).render('errors/error', { layout: 'errors/error', statusCode, errorMessage, message });

  } else if (statusCode === 404) {

    message = "Xin lỗi nhưng chúng tôi không thể tìm thấy trang này. Trang bạn đang tìm kiếm không tồn tại.";
    return res.status(statusCode).render('errors/error', { layout: 'errors/error', statusCode, errorMessage, message });

  } else {

    return res.status(statusCode).render('errors/error' , { layout: 'errors/error', statusCode, errorMessage, message });
  
  }
}

module.exports = errorHandler;