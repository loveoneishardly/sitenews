<div class="container">
    <div class="row align-items-center">
        <div class="col-xl-8 col-lg-8 col-md-12 header-flex">
            <div class="sticky-logo">
                <a href="index.html"><img src="assets/img/logo/logo.png" alt=""></a>
            </div>
            <div class="main-menu d-none d-md-block">
                <nav>                  
				    <ul id="navigation">
				        <?php
							foreach ($menu_company as $keymenu) {
								echo $keymenu['menu'];
							}
						?>
				    </ul>
				</nav>
            </div>
        </div>             
        <div class="col-xl-4 col-lg-4 col-md-4">
            <div class="header-right f-right d-none d-lg-block">
                <div class="dropdown">
				  	<a class="dropdown-toggle" data-toggle="dropdown" href="#"><img src="assets/img/adapt_icon/user-icon.png" alt="">
				  		<?php 
				  			if (isset($_SESSION["trangthai"]) && isset($_SESSION["sansang"])){
				  				if ($_SESSION["trangthai"] >= 1 && $_SESSION["capquanly"] == 0) {
				  					echo 'Xin chào: '.$_SESSION["taikhoan"];
				  				}
				  			} else {
				  				echo 'Thành viên';
				  			}
				  		?>
				  	</a>
				  	<div class="dropdown-menu" role="menu" aria-labelledby="dLabel" style="width: 300px;">
				  		<table style="width: 100%;" border="0">
				  			<?php
				  				if (isset($_SESSION["trangthai"]) && isset($_SESSION["sansang"])){
				  					if ($_SESSION["trangthai"] >= 1 && $_SESSION["capquanly"] == 0) {
					  					echo '
					  						<tr id="user-info">
								  				<td style="width: 40%" align="left">
								  					<span style="margin-left: 20px">Thông tin người dùng</span>
								  				</td>
								  			</tr>
								  			<tr id="user-info">
								  				<td align="left">
								  					<span style="margin-left: 20px"><a href="go?page=_manage&subpages=manage">Quản trị hệ thống</a></span>
							  					</td>
								  			</tr>
								  			<tr id="user-info">
								  				<td align="left">
								  					<span style="margin-left: 20px">Đổi mật khẩu</span>
								  				</td>
								  			</tr>
								  			<tr id="user-login">
								  				<td align="center"><a onclick="logout()">ĐĂNG XUẤT</a></td>
								  			</tr>
					  					';
					  				}
				  				} else {
				  					echo '
				  						<tr id="user-login">
						  				<td align="center"><a href="go?check=_login">ĐĂNG NHẬP</a></td>
						  			</tr>
						  			';
				  				}
				  			?>
				  		</table>
				  	</div>
				</div>
            </div>
        </div>
        <div class="col-12">
            <div class="mobile_menu d-block d-md-none"></div>
        </div>
    </div>
</div>
<script type="text/javascript">
	function logout(){
		$.post( "go", { for: "_logout" }, function( data ) {
      		if(data){
            	location.reload();
         	}
        });
	}
</script>