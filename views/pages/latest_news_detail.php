<div class="about-right mb-90">
    <?php
        foreach ($infoPost as $keyinfoPost) {
            echo '<div class="about-img">
                    <img src="../sitenews/assets/img/trending/trending_top.jpg" alt="">
                </div>';
            echo '<div class="heading-news mb-30 pt-30">
                    <h3>'.$keyinfoPost["title"].'</h3>
                </div>';
            echo '<div class="about-prea">
                <p class="about-pera1 mb-25">'.$keyinfoPost["content"].'</p>
            </div>';
        }
    ?>

    <div class="social-share pt-30">
        <div class="section-tittle">
            <h3 class="mr-20">Share:</h3>
            <ul>
                <li><a href="#"><img src="../sitenews/assets/img/news/icon-ins.png" alt=""></a></li>
                <li><a href="#"><img src="../sitenews/assets/img/news/icon-fb.png" alt=""></a></li>
                <li><a href="#"><img src="../sitenews/assets/img/news/icon-tw.png" alt=""></a></li>
                <li><a href="#"><img src="../sitenews/assets/img/news/icon-yo.png" alt=""></a></li>
            </ul>
        </div>
    </div>
</div>
<!-- From -->
<div class="row">
    <div class="col-lg-8">
        <form class="form-contact contact_form mb-80" action="contact_process.php" method="post" id="contactForm" novalidate="novalidate">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <textarea class="form-control w-100 error" name="message" id="message" cols="30" rows="9" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter Message'" placeholder="Enter Message"></textarea>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <input class="form-control error" name="name" id="name" type="text" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter your name'" placeholder="Enter your name">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <input class="form-control error" name="email" id="email" type="email" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter email address'" placeholder="Email">
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <input class="form-control error" name="subject" id="subject" type="text" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter Subject'" placeholder="Enter Subject">
                    </div>
                </div>
            </div>
            <div class="form-group mt-3">
                <button type="submit" id="guibinhluan" name="guibinhluan" class="button button-contactForm boxed-btn boxed-btn2">Send</button>
            </div>
        </form>
    </div>
</div>
<script type="text/javascript">
    
</script>