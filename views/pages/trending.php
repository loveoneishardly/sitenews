<div class="slider-active">
    <?php
        foreach ($trending_news as $keynews) {
            echo '<div class="single-slider">';
            echo '<div class="trending-top mb-30">';
            echo '<div class="trend-top-img">';
            echo '<img src="'.$keynews['avatar'].'" alt="" >';
            echo '<div class="trend-top-cap">';
            echo '<span class="bgr" data-animation="fadeInUp" data-delay=".2s" data-duration="1000ms">'.$keynews['name'].'</span>';
            if (isset($_SESSION["trangthai"]) && isset($_SESSION["sansang"])){
                echo '<h2><a href="go?page=_detail&slug='.$keynews['slug'].'&id='.$keynews['id'].'" data-animation="fadeInUp" data-delay=".4s" data-duration="1000ms">'.$keynews['title'].'</a></h2>';
            } else {
                echo '<h2><a href="go?check=_detail&slug='.$keynews['slug'].'&id='.$keynews['id'].'" data-animation="fadeInUp" data-delay=".4s" data-duration="1000ms">'.$keynews['title'].'</a></h2>';
            }
            echo '<p data-animation="fadeInUp" data-delay=".6s" data-duration="1000ms">by '.$keynews['name_user'].' - '.$keynews['created_at'].'</p>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
        }
    ?>
</div>