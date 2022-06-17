<?php
    $db = ConnectDb::getInstance()->getConnection();
    $madonvi = '1';
    $stmt = $db->prepare("call p_getthongtin_website(:madonvi);");
    $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
    $stmt -> execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<div class="footer-main footer-bg">
    <div class="footer-area footer-padding">
        <div class="container">
            <div class="row d-flex justify-content-between">
                <div class="col-xl-3 col-lg-3 col-md-5 col-sm-8">
                    <div class="single-footer-caption mb-50">
                        <div class="single-footer-caption mb-30">
                            <!-- logo -->
                            <div class="footer-logo">
                                <a href="index.html"><img src="<?php echo $row['logo']; ?>" alt=""></a>
                            </div>
                            <div class="footer-tittle">
                                <div class="footer-pera">
                                    <p class="info1"><?php echo $row['name']; ?></p>
                                    <p class="info2"><i class="fa fa-map-marker" aria-hidden="true"></i> <?php echo $row['address']; ?></p>
                                    <p class="info2"><i class="fa fa-fax" aria-hidden="true"></i> <?php echo $row['numberphone']; ?></p>
                                    <p class="info2"><i class="fa fa-envelope" aria-hidden="true"></i> <?php echo $row['email']; ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-5 col-sm-7">
                    <div class="single-footer-caption mb-50">
                        <div class="footer-tittle">
                            <h4>Đối tác</h4>
                        </div>
                        <div class="whats-right-single mb-20">
                            <div class="whats-right-img">
                                <img src="assets/img/gallery/footer_post1.png" alt="">
                            </div>
                            <div class="whats-right-cap">
                                <h4><a href="latest_news.php">Dịch vụ 1</a></h4>
                            </div>
                        </div>
                        <div class="whats-right-single mb-20">
                            <div class="whats-right-img">
                                <img src="assets/img/gallery/footer_post2.png" alt="">
                            </div>
                            <div class="whats-right-cap">
                                <h4><a href="latest_news.php">Dịch vụ 2</a></h4>
                            </div>
                        </div>
                        <div class="whats-right-single mb-20">
                            <div class="whats-right-img">
                                <img src="assets/img/gallery/footer_post3.png" alt="">
                            </div>
                            <div class="whats-right-cap">
                                <h4><a href="latest_news.php">Dịch vụ 3</a></h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-5 col-sm-7">
                    <div class="single-footer-caption mb-50">
                        <div class="banner">
                            <img src="assets/img/gallery/body_card4.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- footer-bottom aera -->
    <div class="footer-bottom-area footer-bg">
        <div class="container">
            <div class="footer-border">
                <div class="row d-flex align-items-center">
                    <div class="col-xl-12 ">
                        <div class="footer-copy-right text-center">
                            <p>Copyright &copy;<script>document.write(new Date().getFullYear());</script> LonelyMC</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>