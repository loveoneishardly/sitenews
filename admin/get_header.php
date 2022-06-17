<div class="logo-header" data-background-color="blue">
	<a href="go?page=_manage&subpages=manage" class="logo">
		<p style="color: white; font-size:30px;font-weight: bold;">MC</p>
	</a>
	<button class="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon">
			<i class="icon-menu"></i>
		</span>
	</button>
	<button class="topbar-toggler more"><i class="icon-options-vertical"></i></button>
	<div class="nav-toggle">
		<button class="btn btn-toggle toggle-sidebar">
			<i class="icon-menu"></i>
		</button>
	</div>
</div>

<nav class="navbar navbar-header navbar-expand-lg" data-background-color="blue2">
	<div class="container-fluid">
		<div class="navbar-left" style="color: white; width: 90%;font-weight: bold; font-size:20px">
			<marquee scrollamount="5">
				<input type="text" name="thongbaodonvi" id="thongbaodonvi" style="width: 100%; height: 100%;border: none;font-weight: bold;padding-top: 10px">
			</marquee>
		</div>
		<ul class="navbar-nav topbar-nav ml-md-auto align-items-center">
			<li>
				<input name="header_ngay" id="header_ngay" style="width:auto" readonly="true">
			</li>
			<li class="nav-item dropdown hidden-caret">
				<a class="dropdown-toggle profile-pic" data-toggle="dropdown" href="#" aria-expanded="false">
					<div class="avatar-sm">
						<img src="../manage/lib/img/profile.jpg" alt="..." class="avatar-img rounded-circle">
					</div>
				</a>
				<ul class="dropdown-menu dropdown-user animated fadeIn">
					<div class="dropdown-user-scroll scrollbar-outer">
						<li>
							<div class="user-box">
								<div class="avatar-lg"><img src="../manage/lib/img/profile.jpg" alt="image profile" class="avatar-img rounded"></div>
								<div class="u-text">
									<h4><?php echo $_SESSION["tennhanvien"]; ?></h4>
									<p class="text-muted"><?php echo $_SESSION["email"]; ?></p>
								</div>
							</div>
						</li>
						<li>
							<div class="dropdown-divider"></div>
							<a class="dropdown-item" href="#" style="cursor: pointer;">Thông tin tài khoản</a>
							<a class="dropdown-item" href="#" style="cursor: pointer;">Đổi mật khẩu</a>
							<a class="dropdown-item" onclick="logout()" style="cursor: pointer;">Đăng xuất</a>
						</li>
					</div>
				</ul>
			</li>
		</ul>
	</div>
</nav>
<style type="text/css">
	#thongbaodonvi{
		background: #116adc;
		color: #fff;
	}
	#header_ngay{
		background: #116adc;
		color: #fff; 
		border: none;
		padding-left: 20px;
		padding-right: 0px;
		font-weight: bold;
		font-size: 15px;
	}
</style>
<script type="text/javascript">
	$(document).ready(function () {
		thoigian_header();
		loadthongbaohethong();
	});
	function logout(){
		swal({
			title: 'Bạn có chắc chắn muốn đăng xuất?',
			type: 'warning',
			buttons:{
				confirm: {
					text : 'Đồng Ý',
					className : 'btn btn-success'
				},
				cancel: {
					text : 'Hủy',
					visible: true,
					className: 'btn btn-danger'
				}
			}
		}).then((OK) => {
			if (OK) {
				$.post( "go", { for: "_logout" }, function( data ) {
              		if(data){
	                	location.reload();
	             	}
	            });
			} else {
				swal.close();
			}
		});
	}
	function loadthongbaohethong(){
    	$.ajax({
	      	type: 'POST',
	      	url: 'go',
	      	data: {
	          	for: "getthonbaodonvi",
	          	madonvi: <?php echo $_SESSION["madonvi"]; ?>,
	          	type: ''
	      	}
	    }).done(function(data){
	      	var j_data = JSON.parse(data);
	      	$("#thongbaodonvi").val(j_data[0].thongbao);
	    });
	}
	function thoigian_header() {
        var thoigian = new Date();
        var ngay = addZero(thoigian.getDate());
        var thang = addZero(thoigian.getMonth()+1);
        var nam = addZero(thoigian.getFullYear());
        var date = ngay + '/' + thang + '/' + nam + ' ';
        var gio = addZero(thoigian.getHours());
        var phut = addZero(thoigian.getMinutes());
        var giay = addZero(thoigian.getSeconds());
        var ngaygio = date + gio + ":" + phut + ":" + giay;
        $('#header_ngay').val(ngaygio);
		setTimeout(thoigian_header, 1000);
    }
    function addZero_footer(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
</script>