<?php
session_start();

include_once('controllers/HeThongController.php');
include_once('controllers/QuanTriController.php');
include_once('controllers/PostNewsController.php');

if(isset($_GET['check'])) {
  ob_start();
  switch ($_GET['check']) {
        case "_home":
            $menu_company = (new HeThongController())->Fload_danhsachmenu('1');
            $trending_news = (new HeThongController())->Fload_trending_new('1','1');
            $trending_right = (new HeThongController())->Fload_trending_new('1','2');
            $tabnews = (new HeThongController())->Fload_tabcontent_new('1');
            $tabchild_card = (new HeThongController())->Fload_tabchild_card('1');
            $loadvideo = (new HeThongController())->Fload_video('1');
            include("views/pages/index.php");
            break;
        case "_login":
            include("views/pages/login.php");
            break;
        case "_mlogin":
            include("php/pages/mobile/fmlogin.php");
            break;
        case "_detail":
            $slugpost = $_GET['slug'];
            $idpost = $_GET['id'];
            $menu_company = (new HeThongController())->Fload_danhsachmenu('1');
            $infoPost = (new PostNewsController())->Fload_detail_postnews('1',$slugpost,$idpost);

            //print_r(array($infoPost));
            include("views/pages/latest_news.php");
            break;
        default:
           include("views/pages/perror.php");
  }
  echo ob_get_clean();
}

//if(!isset($_SESSION["sansang"])){
//  header("Location: go?check=_login");
//}

if(isset($_POST['for'])) {
  switch ($_POST['for']) {
        case "check_captcha":
            if (isset($_POST['captcha'])){
                if (strtolower($_SESSION['captcha']) != strtolower(trim($_POST['captcha']))){
                    echo json_encode(array("trangthai" => 'false', "cap" => $_SESSION['captcha']));
                } else {
                    echo json_encode(array("trangthai" => 'true', "cap" => $_SESSION['captcha']));
                }
            }
        break;
        case "login":
            if(isset($_POST['taikhoan']) && isset($_POST['matkhau']) && isset($_POST['mobile'])){
                $md5pass = md5($_POST['matkhau']);
                $trangthai = (new HeThongController())->FLogin($_POST['taikhoan'], $md5pass);
                $cre_menu = "";
                if ($_SESSION["chot_menu_quantri"] == 1) {
                    $_SESSION["menusudung"] = $_SESSION["menu_quantri"];
                    echo json_encode(array_merge($trangthai, array("menu" => $_SESSION["menusudung"],"updnv" => "-1", "xoamenu" => "-1")));
                } else {
                    $dsmenucha = (new HeThongController())->FGetmenuquantridonvi($_SESSION["madonvi"]);
                    foreach ($dsmenucha as $keymenucha){
                        $cre_menu .= "<li class=\"nav-item active\">";
                        $cre_menu .= "<a data-toggle=\"collapse\" href=\"#".$keymenucha['mn_duonglink']."\" class=\"collapsed\" aria-expanded=\"false\">";
                        $cre_menu .= "<i class=\"".$keymenucha['mn_icon_class']."\"></i>";
                        $cre_menu .= "<p>".$keymenucha['mn_tenmenu']."</p>";
                        $cre_menu .= "<span class=\"".$keymenucha['mn_cha_class']."\"></span>";
                        $cre_menu .= "</a>";
                        $cre_menu .= "<div class=\"collapse\" id=\"".$keymenucha['mn_duonglink']."\">";
                        $cre_menu .= "<ul class=\"nav nav-collapse\">";
                        $dsmenucontheomenucha = (new HeThongController())->FGetmenucontheomenucha($_SESSION["madonvi"],$keymenucha['mn_idmenu']);
                        foreach ($dsmenucontheomenucha as $keymenuccon){
                            $cre_menu .= "<li><a href=\"go?page=_manage"."&subpages=".$keymenuccon['mn_duonglink']."\"><span class=\"sub-item\">".$keymenuccon['mn_tenmenu']."</span></a></li>";
                        }
                        $cre_menu .= "</ul></div></li>";
                    }
                    $xoamenunhanvien = (new HeThongController())->FXoamenuquantri($_SESSION["madonvi"]);
                    $_SESSION["menusudung"] = $cre_menu;
                    $updmenunhanvien = (new HeThongController())->FUpdatemenuquantri($_SESSION["madonvi"],$cre_menu);
                    echo json_encode(array_merge($trangthai, array("menu" => $_SESSION["menusudung"],"updnv" => $updmenunhanvien, "xoamenu" => $xoamenunhanvien)));
                }
            }
            break;
        case "themmatkhau":
            if(isset($_POST['matkhaumoi'])){
              $md5pass = md5($_POST['matkhaumoi']);
              $ret = (new TaiKhoanController())->FCapnhatmatkhau($_SESSION["taikhoan"], "-", $md5pass);
              $_SESSION["sansang"] = $ret["trangthai"];
              echo json_encode($ret);
            }
            break;
        case "capnhatmatkhau":
            if(isset($_POST['matkhaucu']) && isset($_POST['matkhaumoi'])){
              $md5passcu = md5($_POST['matkhaucu']);
              $md5passmoi = md5($_POST['matkhaumoi']);
              $trangthai = (new TaiKhoanController())->FCapnhatmatkhau($_SESSION["taikhoan"], $md5passcu, $md5passmoi);
              echo json_encode($trangthai);
            }
            break;
        case "load_dsnhanvien":
            if(isset($_POST["madonvi"])){
                $madonvi = $_POST["madonvi"];
                $dsnhanvien = (new TaiKhoanController())->Fload_dsnhanvien($madonvi);

                $rowspg = array_slice($dsnhanvien, ((intval($_POST['page']) -1) * intval($_POST['rows'])), intval($_POST['rows']));
                $footer = array(array("nv_hoten"=>"Tổng: ".count($dsnhanvien)));
                echo json_encode(array("total"=>count($dsnhanvien), "rows"=>$rowspg, "footer"=>$footer));
            }
            break;
        case "getthonbaodonvi":
            if(isset($_SESSION['madonvi'])){
              $madonvi = $_POST['madonvi'];
              $type = $_POST['type'];
              $trangthai = (new TaiKhoanController())->FGetthongbao($madonvi,$type);
              echo json_encode($trangthai);
            }
            break;
        case "load_dsmenu":
            if(isset($_SESSION['madonvi'])){
                $madonvi = $_POST['madonvi'];
                $dsmenucha_donvi = (new TaiKhoanController())->FGetmenuchadonvi($madonvi);
                $strmenu = "";
                $strmenu .= "[";
                foreach ($dsmenucha_donvi as $keycha){
                    $strmenu .= "{ \"title\":\"<span style='color: blue;font-weight: bold; font-size: 13px'>".$keycha['mn_tenmenu']."</span>\", \"key\":\"".$keycha['mn_idmenu']."\",\"expanded\": true";
                    $dsmenucon_theomenucha_donvi = (new TaiKhoanController())->FGetmenucontheomenuchadonvi($madonvi,$keycha['mn_idmenu']);
                    $strmenu .= ", \"children\": [ ";
                    foreach ($dsmenucon_theomenucha_donvi as $keycon){
                        $strmenu .= "{\"title\":\"<span style='font-weight: bold;'>".$keycon['mn_tenmenu']."</span>\", \"key\":\"".$keycon['mn_idmenu']."\" },";
                    }
                    $strmenu = substr($strmenu, 0, strlen($strmenu) - 1);
                    $strmenu .= "]},";
                }
                $strmenu = substr($strmenu, 0, strlen($strmenu) - 1);
                $strmenu .= "]";
                echo $strmenu;
            }
            break;
        case "load_dsmenu_nhanvien":
            if(isset($_SESSION['madonvi'])){
                $madonvi = $_POST['madonvi'];
                $dsmenu_nhanvien = (new TaiKhoanController())->FGetmenudonvi_nhanvien($madonvi);
                $strnhanvien = "";
                $strnhanvien .= "[";
                $strnhanvien .= "{ \"title\":\"<span style='color: blue;font-weight: bold; font-size: 13px'>".$_SESSION['tendonvi']."</span>\", \"key\":0,\"expanded\": true";
                $strnhanvien .= ", \"children\": [ ";
                foreach ($dsmenu_nhanvien as $key){
                    $strnhanvien .= "{\"title\":\"<span style='font-weight: bold;'>".$key['nv_hoten']."</span>\", \"key\":\"".$key['nv_ma']."\" },";
                }
                $strnhanvien = substr($strnhanvien, 0, strlen($strnhanvien) - 1);
                $strnhanvien .= "]}]";
                echo $strnhanvien;
            }
            break;
        case "getmenutheonhanvien":
            if(isset($_SESSION['madonvi'])){
                $madonvi = $_SESSION['madonvi'];
                $manhanvien = $_POST['manhanvien'];
                $trangthai = (new TaiKhoanController())->FGetmenutheonhanvien($madonvi,$manhanvien);
                echo json_encode($trangthai);
            }
            break;
        case "phanquyenmenutheonhanvien":
            if(isset($_SESSION['madonvi'])){
                $madonvi = $_SESSION['madonvi'];
                $dsmanhanvien = urldecode($_POST['dsmanhanvien']);
                $arr_dsmanhanvien = explode("```", $dsmanhanvien);
                $dsmamenu = urldecode($_POST['dsmamenu']);
                $arr_dsmamenu = explode("```", $dsmamenu);
                foreach ((array) $arr_dsmanhanvien as $keynhanvien){
                    $xoamenu_nhanvien = (new TaiKhoanController())->FXoaphanquyenmenunhanvien($madonvi,$keynhanvien);
                    foreach ((array) $arr_dsmamenu as $keymenu){
                        $themmenunhanvien = (new TaiKhoanController())->FThemmenunhanvien($madonvi,$keynhanvien,$keymenu);
                    }
                }
                echo json_encode($themmenunhanvien);
            }
            break;
        case "load_dsmenudonvi":
            if(isset($_SESSION['madonvi'])){
                $madonvi = $_POST["madonvi"];
                $dsmenu = (new DanhMucController())->Fload_dsmenudonvi($madonvi);
                $rowspg = array_slice($dsmenu, ((intval($_POST['page']) -1) * intval($_POST['rows'])), intval($_POST['rows']));
                $footer = array(array("mn_tenmenu"=>"Tổng: ".count($dsmenu)));
                echo json_encode(array("total"=>count($dsmenu), "rows"=>$rowspg, "footer"=>$footer));
            }
            break;
        case "themmenudonvi":
            if(isset($_SESSION['madonvi'])){
                $madonvi = $_SESSION['madonvi'];
                $tenmenu = $_POST["tenmenu"];
                $capmenu = $_POST["capmenu"];
                $duongdan = $_POST["duongdan"];
                $mamenucha = $_POST["mamenucha"];
                $sapxep = $_POST["sapxep"];
                $classicon = $_POST["classicon"];
                $trangthai = (new DanhMucController())->Fload_themmenudonvi($madonvi,$tenmenu,$capmenu,$duongdan,$mamenucha,$sapxep,$classicon);
                echo json_encode($trangthai);
            }
            break;
        case "luuthoigian":
            if(isset($_SESSION['madonvi'])){
                $min = $_POST['min'];
                $sec = $_POST["sec"];
                $trangthai = (new DanhMucController())->Fluuthoigian($min,$sec);
                echo json_encode($trangthai);
            }
            break;
        case "loaddanhsachbandonvi":
            if(isset($_SESSION['madonvi'])){
              $madonvi = $_POST['madonvi'];
              $trangthai = (new DanhMucController())->Fload_dsban($_SESSION['madonvi']);
              echo json_encode(array("danhsachban" => $trangthai));
            }
            break;
        case "loadnews_trendingleft":
            if(isset($_SESSION['madonvi'])){
                $typenews = $_POST['typenews'];
                $madonvi = $_POST['madonvi'];
                $trangthai = (new QuanTriController())->Fload_newslide_trendingleft($madonvi,$typenews);
                echo json_encode(array("danhsachban" => $trangthai));
            }
            break;
        case "_logout":
            echo (new HeThongController())->FLogout();
            break;
        default:
            echo json_encode(array("0" => array("ketqua"=>"999")));
    }

}


if(isset($_GET['page'])) {
  if(!isset($_SESSION["sansang"])){
    header("Location: go?check=_home");
  } else {
    if($_SESSION["sansang"] != "1"){
      header("Location: go?check=_home");
    }
  }

  ob_start();
  switch ($_GET['page']) {
        case "_home":
            $menu_company = (new HeThongController())->Fload_danhsachmenu('1');
            $trending_news = (new HeThongController())->Fload_trending_new('1','1');
            $trending_right = (new HeThongController())->Fload_trending_new('1','2');
            $tabnews = (new HeThongController())->Fload_tabcontent_new('1');
            $tabchild_card = (new HeThongController())->Fload_tabchild_card('1');
            $loadvideo = (new HeThongController())->Fload_video('1');
            include("views/pages/index.php");
            break;
        case "_login":
            include("views/pages/login.php");
            break;
        case "_manage":
            include("admin/index.php");
            break;
        case "_detail":
            $menu_company = (new HeThongController())->Fload_danhsachmenu('1');
            include("views/pages/latest_news.php");
            break;
        default:
           include("views/pages/perror.php");
    }
    echo ob_get_clean();
}

?>