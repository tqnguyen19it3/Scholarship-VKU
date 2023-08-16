// handle change password
async function handleChangePassword() {
    const { value: formValues } = await Swal.fire({
        title: 'Change Password',
        html:
        '<input id="oldPassword" type="password" pattern="[0-9a-zA-Z@#$%&]{6,}" placeholder="Current password" class="swal2-input" required>' +
        '<input id="newPassword" type="password" pattern="[0-9a-zA-Z@#$%&]{6,}" placeholder="New password" class="swal2-input" required>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;

            try {
                const response = await axios.post('http://localhost:5500/api/auth/reset-password', { oldPassword, newPassword });
                if (response.status === 200) {
                    return response.data;
                } else {
                    throw new Error('Đổi mật khẩu thất bại. Vui lòng thử lại sau.');
                }
            } catch (error) {
                Swal.showValidationMessage(`Lỗi: ${error}`);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            // Xử lý phản hồi từ máy chủ (nếu cần)
            Swal.fire({
                title: 'Successfully',
                text: result.value.message,
                icon: 'success'
            });
        }
    });
}