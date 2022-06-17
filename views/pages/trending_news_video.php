<div class="row">
    <div class="col-lg-12">
        <div class="section-tittle mb-30">
            <h3>Xu hướng</h3>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <div class="recent-active dot-style d-flex dot-style">
            <?php
                $db = ConnectDb::getInstance()->getConnection();
                $madonvi = '1';
                $typenews = '6';
                $stmt = $db->prepare("call p_gettrending_news(:madonvi, :typenews);");
                $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
                $stmt -> bindParam(':typenews', $typenews, PDO::PARAM_STR);
                $stmt -> execute();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    echo '<div class="single-recent">';
                        echo '<div class="what-img">';
                            echo '<img src="'.$row['avatar'].'" alt="">';
                        echo '</div>';
                        echo '<div class="what-cap">';
                            echo '<h4><a href="#" > <h4><a href="latest_news.php">'.$row['title'].'</a></h4></a></h4>';
                            echo '<P>'.$keynews['created_at'].'</P>';
                            echo '<a class="popup-video btn-icon" href="'.$row['linkvideo'].'"><span class="flaticon-play-button"></span></a>';
                        echo '</div>';
                     echo '</div>';
                }
            ?>
        </div>
    </div>
</div>