<div class="row">
    <div class="col-12">
        <div class="video-items-active">
            <?php 
                foreach ($loadvideo as $keynews) {
                    echo '<div class="video-items text-center">';
                    echo '<video controls>';
                    echo '<source src="'.$keynews['link'].'" type="video/mp4">Your browser does not support the video tag.';
                    echo '</video>';
                    echo '</div>';
                }
            ?>
        </div>
    </div>
</div>
<div class="video-info">
    <div class="row">
        <div class="col-12">
            <div class="testmonial-nav text-center">
                <?php 
                    foreach ($loadvideo as $keynews) {
                        echo '<div class="single-video">';
                            echo '<video controls>';
                                echo '<source src="'.$keynews['link'].'" type="video/mp4">Your browser does not support the video tag.';
                            echo '</video>';
                            echo '<div class="video-intro">';
                                echo '<h4>'.$keynews['title'].'</h4>';
                            echo '</div>';
                        echo '</div>';
                    }
                ?>
            </div>
        </div>
    </div>
</div>