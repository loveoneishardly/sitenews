<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>Quản trị hệ thống</title>
	<meta content='width=device-width, initial-scale=1.0, shrink-to-fit=no' name='viewport' />
	<link rel="icon" href="./admin/assets/img/icons/shop-icon.png" type="image/x-icon"/>
	<link rel="touch-icon" sizes="76x76" href="./admin/assets/img/icons/shop-icon.png" type="image/x-icon"/>
	<script src="./admin/assets/js/plugin/webfont/webfont.min.js"></script>
	<script>
		WebFont.load({
			google: {"families":["Lato:300,400,700,900"]},
			custom: {"families":["Flaticon", "Font Awesome 5 Solid", "Font Awesome 5 Regular", "Font Awesome 5 Brands", "simple-line-icons"], urls: ['./admin/assets/css/fonts.min.css']},
			active: function() {
				sessionStorage.fonts = true;
			}
		});
	</script>
	<link rel="stylesheet" href="./admin/assets/css/bootstrap.min.css">
	<link rel="stylesheet" href="./admin/assets/css/atlantis.min.css">
	<link rel="stylesheet" href="./admin/assets/css/demo.css">
	<script src="//code.jquery.com/jquery-3.1.0.min.js" type="text/javascript"></script>
  	<script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>
	<script src="./admin/assets/js/core/popper.min.js"></script>
	<script src="./admin/assets/js/core/bootstrap.min.js"></script>
	<script src="./admin/assets/js/plugin/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
	<script src="./admin/assets/js/plugin/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js"></script>
	<script src="./admin/assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js"></script>
	<script src="./admin/assets/js/plugin/jquery.sparkline/jquery.sparkline.min.js"></script>
	<script src="./admin/assets/js/plugin/bootstrap-notify/bootstrap-notify.min.js"></script>
	<script src="./admin/assets/js/plugin/sweetalert/sweetalert.min.js"></script>
	<script src="./admin/assets/js/atlantis.min.js"></script>
	<script src="./admin/assets/js/setting-demo.js"></script>
    <script src="./admin/assets/js/plugin/datatables/datatables.min.js"></script>
	<script type="text/javascript" src="./admin/assets/lib.js"></script>


	<style type="text/css">
	</style>
	<script type="text/javascript">
		$(document).ready(function () {
		});
	</script>
</head>
<body>
	<div class="wrapper">
		<div class="main-header">
			<?php include_once('./admin/get_header.php'); ?>
		</div>
		<div class="sidebar sidebar-style-2">			
			<?php include_once('./admin/get_menu.php'); ?>
		</div>
		<div class="main-panel">
			<div class="content">
				<div class="page-inner">
					<div class="page-header">
						<h4 class="page-title">Quản trị hệ thống </h4>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="card">
								<?php
									$p = $_GET['page'];
									$s = $_GET['subpages'];
									$page = "admin/pages/".$s.".php";
									if (file_exists($page)) {
										include($page);
									} else {
										echo 'Trang không tìm thấy!'.'***'.$p.'***'.$s.'***'.$page;
									}
								?>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer class="footer">
				<?php include_once('./admin/get_footer.php'); ?>
			</footer>
		</div>

		<div class="custom-template">
			<?php include_once('./admin/get_message.php'); ?>
		</div>
	</div>
</body>
</html>