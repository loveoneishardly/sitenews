<!doctype html>
<html class="no-js" lang="zxx">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>
        <?php foreach ($infoPost as $title) {
            echo $title['title'];
                } 
        ?>
    </title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="../sitenews/assets/img/favicon.ico">
    <!-- CSS here -->
    <link rel="stylesheet" href="../sitenews/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="../sitenews/assets/css/owl.carousel.min.css">
    <link rel="stylesheet" href="../sitenews/assets/css/ticker-style.css">
    <link rel="stylesheet" href="../sitenews/assets/css/flaticon.css">
    <link rel="stylesheet" href="../sitenews/assets/css/slicknav.css">
    <link rel="stylesheet" href="../sitenews/assets/css/animate.min.css">
    <link rel="stylesheet" href="../sitenews/assets/css/magnific-popup.css">
    <link rel="stylesheet" href="../sitenews/assets/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="../sitenews/assets/css/themify-icons.css">
    <link rel="stylesheet" href="../sitenews/assets/css/slick.css">
    <link rel="stylesheet" href="../sitenews/assets/css/nice-select.css">
    <link rel="stylesheet" href="../sitenews/assets/css/style.css">
</head>
    
<body>
<!-- Preloader Start -->
<div id="preloader-active">
    <div class="preloader d-flex align-items-center justify-content-center">
        <div class="preloader-inner position-relative">
            <div class="preloader-circle"></div>
            <div class="preloader-img pere-text">
                <img src="../sitenews/assets/img/logo/logo.png" alt="">
            </div>
        </div>
    </div>
</div>
<!-- Preloader Start -->
<header>
    <!-- Header Start -->
    <div class="header-area">
        <div class="main-header ">
            <div class="header-top black-bg d-none d-sm-block">
                <div class="container">
                    <div class="col-xl-12">
                        <div class="row d-flex justify-content-between align-items-center">
                            <div class="header-info-left">
                                <ul>     
                                    <li class="title"><span class="flaticon-energy"></span> trending-title</li>
                                    <li>Class property employ ancho red multi level mansion</li>
                                </ul>
                            </div>
                            <div class="header-info-right">
                                <ul class="header-date">
                                    <li><span class="flaticon-calendar"></span> +880166 253 232</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="header-mid gray-bg">
                <div class="container">
                    <div class="row d-flex align-items-center">
                        <!-- Logo -->
                        <div class="col-xl-3 col-lg-3 col-md-3 d-none d-md-block">
                            <div class="logo">
                                <a href="go?check=_home"><img src="../sitenews/assets/img/logo/logo.png" alt=""></a>
                            </div>
                        </div>
                        <div class="col-xl-9 col-lg-9 col-md-9">
                            <div class="header-banner f-right ">
                                <img src="../sitenews/assets/img/gallery/header_card.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="header-bottom header-sticky">
                <?php include_once('menu.php'); ?>
            </div>
        </div>
    </div>
    <!-- Header End -->
</header>
<main>
    <!-- About US Start -->
    <div class="about-area2 gray-bg pt-60 pb-60">
        <div class="container">
                <div class="row">
                    <div class="col-lg-8">
                        <?php include_once('latest_news_detail.php'); ?>
                    </div>
                    <div class="col-lg-4">
                        <!-- Flow Socail -->
                        <div class="single-follow mb-45">
                            <div class="single-box">
                                <div class="follow-us d-flex align-items-center">
                                    <div class="follow-social">
                                        <a href="#"><img src="../sitenews/assets/img/news/icon-fb.png" alt=""></a>
                                    </div>
                                    <div class="follow-count">  
                                        <span>8,045</span>
                                        <p>Fans</p>
                                    </div>
                                </div> 
                                <div class="follow-us d-flex align-items-center">
                                    <div class="follow-social">
                                        <a href="#"><img src="../sitenews/assets/img/news/icon-tw.png" alt=""></a>
                                    </div>
                                    <div class="follow-count">
                                        <span>8,045</span>
                                        <p>Fans</p>
                                    </div>
                                </div>
                                    <div class="follow-us d-flex align-items-center">
                                    <div class="follow-social">
                                        <a href="#"><img src="../sitenews/assets/img/news/icon-ins.png" alt=""></a>
                                    </div>
                                    <div class="follow-count">
                                        <span>8,045</span>
                                        <p>Fans</p>
                                    </div>
                                </div>
                                <div class="follow-us d-flex align-items-center">
                                    <div class="follow-social">
                                        <a href="#"><img src="../sitenews/assets/img/news/icon-yo.png" alt=""></a>
                                    </div>
                                    <div class="follow-count">
                                        <span>8,045</span>
                                        <p>Fans</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- New Poster -->
                        <div class="news-poster d-none d-lg-block">
                            <img src="../sitenews/assets/img/news/news_card.jpg" alt="">
                        </div>
                    </div>
                </div>
        </div>
    </div>
    <!-- About US End -->
</main>
<footer>
    <?php include_once('../sitenews/views/pages/footer.php'); ?>
</footer>
<!-- Search model Begin -->
<div class="search-model-box">
    <div class="d-flex align-items-center h-100 justify-content-center">
        <div class="search-close-btn">+</div>
        <form class="search-model-form">
            <input type="text" id="search-input" placeholder="Searching key.....">
        </form>
    </div>
</div>
<!-- Search model end -->

<!-- JS here -->

    <script src="../sitenews/assets/js/vendor/modernizr-3.5.0.min.js"></script>
    <!-- Jquery, Popper, Bootstrap -->
    <script src="../sitenews/assets/js/vendor/jquery-1.12.4.min.js"></script>
    <script src="../sitenews/assets/js/popper.min.js"></script>
    <script src="../sitenews/assets/js/bootstrap.min.js"></script>
    <!-- Jquery Mobile Menu -->
    <script src="../sitenews/assets/js/jquery.slicknav.min.js"></script>

    <!-- Jquery Slick , Owl-Carousel Plugins -->
    <script src="../sitenews/assets/js/owl.carousel.min.js"></script>
    <script src="../sitenews/assets/js/slick.min.js"></script>
    <!-- Date Picker -->
    <script src="../sitenews/assets/js/gijgo.min.js"></script>
    <!-- One Page, Animated-HeadLin -->
    <script src="../sitenews/assets/js/wow.min.js"></script>
    <script src="../sitenews/assets/js/animated.headline.js"></script>
    <script src="../sitenews/assets/js/jquery.magnific-popup.js"></script>

    <!-- Scrollup, nice-select, sticky -->
    <script src="../sitenews/assets/js/jquery.scrollUp.min.js"></script>
    <script src="../sitenews/assets/js/jquery.nice-select.min.js"></script>
    <script src="../sitenews/assets/js/jquery.sticky.js"></script>
    
    <!-- contact js -->
    <script src="../sitenews/assets/js/contact.js"></script>
    <script src="../sitenews/assets/js/jquery.form.js"></script>
    <script src="../sitenews/assets/js/jquery.validate.min.js"></script>
    <script src="../sitenews/assets/js/mail-script.js"></script>
    <script src="../sitenews/assets/js/jquery.ajaxchimp.min.js"></script>
    
    <!-- Jquery Plugins, main Jquery -->	
    <script src="../sitenews/assets/js/plugins.js"></script>
    <script src="../sitenews/assets/js/main.js"></script>
    
</body>
</html>