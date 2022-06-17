<div class="row">
    <?php
        foreach ($trending_right as $keynews) {
            echo '<div class="col-lg-12 col-md-6 col-sm-6">';
            echo '<div class="trending-top mb-30">';
            echo '<div class="trend-top-img">';
            echo '<img src="'.$keynews['avatar'].'" alt="" >';
            echo '<div class="trend-top-cap trend-top-cap2">';
            echo '<span class="bgg">'.$keynews['name'].'</span>';
            if (isset($_SESSION["trangthai"]) && isset($_SESSION["sansang"])){
                echo '<h2><a href="go?page=_detail&slug='.$keynews['slug'].'&id='.$keynews['id'].'">'.$keynews['title'].'</a></h2>';
            } else {
                echo '<h2><a href="go?check=_detail&slug='.$keynews['slug'].'&id='.$keynews['id'].'">'.$keynews['title'].'</a></h2>';
            }
            echo '<p>by '.$keynews['name_user'].' - '.$keynews['created_at'].'</p>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
        }
    ?>
    <!--<span class="bgg">TECH </span> -->
</div>