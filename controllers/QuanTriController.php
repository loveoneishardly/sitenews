<?php
require_once('config/ConnectDb.php');

class QuanTriController {
	public function Fload_newslide_trendingleft($madonvi,$typenews){
    	$pdo = ConnectDb::getInstance()->getConnection();
     	$stmt = $pdo->prepare("call p_loadnews_trendingleft(:madonvi, :typenews);");
    	$stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
    	$stmt -> bindParam(':typenews', $typenews, PDO::PARAM_STR);
    	$stmt -> execute();
      	return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}
}
?>