<?php
require_once('config/ConnectDb.php');

class HeThongController {
  	public function Fload_danhsachmenu($madonvi){
    	$pdo = ConnectDb::getInstance()->getConnection();
     	$stmt = $pdo->prepare("call p_getmenu(:madonvi);");
    	$stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
    	$stmt -> execute();
      	return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function FLogin($taikhoan, $matkhau){
	    $pdo = ConnectDb::getInstance()->getConnection();
	    $stmt = $pdo->prepare("call p_dangnhap(:taikhoan, :matkhau);");
	    $stmt -> bindParam(':taikhoan', $taikhoan, PDO::PARAM_STR);
	    $stmt -> bindParam(':matkhau', $matkhau, PDO::PARAM_STR);
	    $stmt -> execute();
	    if($stmt->rowCount() > 0){
	      $row = $stmt->fetch();
	        $_SESSION["manhanvien"] = $row["id"];
	        $_SESSION["taikhoan"] = $row["username"];
	        $_SESSION["tennhanvien"] = $row["name_user"];
	        $_SESSION["capquanly"] = $row["role"];
	        $_SESSION["ngaysinh"] = $row["birthday"];
	        $_SESSION["sansang"] = $row["status_user"];
	        $_SESSION["email"] = $row["email"];
	        $_SESSION["trangthai"] = $row["status_user"];
	        $_SESSION["donvi_tendonvi"] = $row["name"];
	        $_SESSION["donvi_diachi"] = $row["address"];
	        $_SESSION["donvi_logo"] = $row["logo"];
	        $_SESSION["donvi_sodienthoai"] = $row["numberphone"];
	        $_SESSION["donvi_email"] = $row["email"];
	        $_SESSION["madonvi"] = $row["madonvi"];
	        $_SESSION["menu_quantri"] = $row["menu_quantri"];
        	$_SESSION["chot_menu_quantri"] = $row["status_menu_quantri"];
	    return array("trangthai" => $row["status_user"], "cap" => $row["role"]);
  	} else {
	      return array("trangthai" => -1, "cap" => -1);
	    }
  	}

  	public function Fload_trending_new($madonvi,$typenews){
    	$pdo = ConnectDb::getInstance()->getConnection();
     	$stmt = $pdo->prepare("call p_gettrending_news(:madonvi, :typenews);");
    	$stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
    	$stmt -> bindParam(':typenews', $typenews, PDO::PARAM_STR);
    	$stmt -> execute();
      	return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function Fload_tabcontent_new($madonvi){
    	$pdo = ConnectDb::getInstance()->getConnection();
     	$stmt = $pdo->prepare("call p_tabcontent_news(:madonvi);");
    	$stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
    	$stmt -> execute();
      	return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function Fload_tabchild_card($madonvi){
    	$pdo = ConnectDb::getInstance()->getConnection();
     	$stmt = $pdo->prepare("call p_tabchild_card_news(:madonvi);");
    	$stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
    	$stmt -> execute();
      	return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function Fload_video($madonvi){
    	$pdo = ConnectDb::getInstance()->getConnection();
     	$stmt = $pdo->prepare("call p_load_video(:madonvi);");
    	$stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
    	$stmt -> execute();
      	return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function FGetmenuquantridonvi($madonvi){
	    $pdo = ConnectDb::getInstance()->getConnection();
	    $stmt = $pdo->prepare("call p_get_menuchaquantridonvi(:madonvi);");
	    $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
	    $stmt -> execute();
	    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function FGetmenucontheomenucha($madonvi,$mamenucha){
	    $pdo = ConnectDb::getInstance()->getConnection();
	    $stmt = $pdo->prepare("call p_get_menucontheomenucha(:madonvi, :mamenucha);");
	    $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
	    $stmt -> bindParam(':mamenucha', $mamenucha, PDO::PARAM_STR);
	    $stmt -> execute();
	    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function FXoamenuquantri($madonvi){
	    $pdo = ConnectDb::getInstance()->getConnection();
	    $stmt = $pdo->prepare("call p_delete_menu_hethongquantri(:madonvi);");
	    $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
	    $stmt -> execute();
	    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function FUpdatemenuquantri($madonvi,$menudonvi){
	    $pdo = ConnectDb::getInstance()->getConnection();
	    $stmt = $pdo->prepare("call p_capnhat_menu_hethongquantri(:madonvi, :menudonvi);");
	    $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
	    $stmt -> bindParam(':menudonvi', $menudonvi, PDO::PARAM_STR);
	    $stmt -> execute();
	    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}

  	public function FLogout(){
	    if(isset($_SESSION["manhanvien"])){
	      unset($_SESSION["manhanvien"]);
	      session_destroy();
	      return 1;
	    } else {
	      return 0;
	    }
  	}
}
?>