<!DOCTYPE html>
<html lang="en">
<head>
	<title>Login V18</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="assets/img/favicon.ico">
	<link rel="stylesheet" type="text/css" href="../sitenews/views/css/util.css">
	<link rel="stylesheet" type="text/css" href="../sitenews/views/css/main.css">
	<link rel="stylesheet" type="text/css" href="../sitenews/views/fonts/font-awesome-4.7.0/css/font-awesome.min.css">
</head>
<body style="background-color: #666666;">
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<form class="login100-form validate-form" id="fkeyformdangnhap">
					<span class="login100-form-title p-b-43">
						THÀNH VIÊN
					</span>
					<div class="wrap-input100 validate-input" data-validate = "Tên đăng nhập trống">
						<input class="input100" type="text" name="username" id="username">
						<span class="focus-input100"></span>
						<span class="label-input100">Tên đăng nhập</span>
					</div>
					
					
					<div class="wrap-input100 validate-input" data-validate="Mật khẩu trống">
						<input class="input100" type="password" name="pass" id="pass">
						<span class="focus-input100"></span>
						<span class="label-input100">Mật khẩu</span>
					</div>

					<div class="flex-sb-m w-full p-t-3 p-b-32">
						<div class="contact100-form-checkbox">
							<input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me">
							<label class="label-checkbox100" for="ckb1">
								Nhớ tài khoản
							</label>
						</div>

						<div>
							<a href="#" class="txt1">
								Quên mật khẩu?
							</a>
						</div>
					</div>
			

					<div class="container-login100-form-btn">
						<button class="login100-form-btn" onclick="$('#fkeyformdangnhap').submit();">
							Đăng nhập
						</button>
					</div>
					
					<div class="text-center p-t-46 p-b-20">
						<span class="txt2">
							đăng ký ngay
						</span>
					</div>

					<div class="login100-form-social flex-c-m">
						<a href="go?check=_home">QUAY LẠI</a>
					</div>
				</form>

				<div class="login100-more" style="background-image: url('../sitenews/img/1Zoc.gif');">
				</div>
				
			</div>
		</div>
	</div>
	<script src="../sitenews/views/js/jquery-3.2.1.min.js"></script>
	<script src="../sitenews/views/js/main.js"></script>
	<script src="../sitenews/views/js/lib.js"></script>
	<script type="text/javascript">
		$(function(){
			$('#fkeyformdangnhap').on('submit', function(donard){
				donard.preventDefault();
				var username = $("#username").val();
				var password = $("#pass").val();
				$.ajax({
					type: 'POST',
					url: 'go',
					data: {
						for: "login",
						taikhoan: username,
						matkhau: MD5(password),
						mobile: 0
					}
				}).done(function(ret){
					var val = JSON.parse(ret);
					if(val.trangthai == "1"){
						window.location.href = "go?page=_home";
					} else {
						
					}
				});
			});
		});
	</script>
</body>
</html>