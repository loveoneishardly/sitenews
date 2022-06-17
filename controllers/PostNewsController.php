<?php
require_once('config/ConnectDb.php');

class PostNewsController {
	public function Fload_detail_postnews($madonvi,$slug,$idpost){
    	$pdo = ConnectDb::getInstance()->getConnection();
     	$stmt = $pdo->prepare("call p_getinfo_postnews(:madonvi,:slug,:idpost);");
    	$stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
    	$stmt -> bindParam(':slug', $slug, PDO::PARAM_STR);
    	$stmt -> bindParam(':idpost', $idpost, PDO::PARAM_STR);
    	$stmt -> execute();
      	return $stmt->fetchAll(PDO::FETCH_ASSOC);
  	}
}