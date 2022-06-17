<div class="row">
    <div class="col-lg-12">
        <div class="small-tittle mb-30">
            <h4>Phổ biến</h4>
        </div>
    </div>
</div>
<!-- Slider -->
<div class="row">
    <div class="col-lg-12">
        <div class="weekly2-news-active d-flex">
            <?php
                $db = ConnectDb::getInstance()->getConnection();
                $madonvi = '1';
                $typenews = '5';
                $stmt = $db->prepare("call p_gettrending_news(:madonvi, :typenews);");
                $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
                $stmt -> bindParam(':typenews', $typenews, PDO::PARAM_STR);
                $stmt -> execute();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    echo '<div class="weekly2-single">';
                        echo '<div class="weekly2-img">';
                            echo '<img src="'.$row['avatar'].'" alt="">';
                        echo '</div>';
                        echo '<div class="weekly2-caption">';
                            echo '<h4><a href="#">'.$row['title'].'</a></h4>';
                            echo '<p>'.$row['name_user'].' | '.$row['created_at'].'</p>';
                        echo '</div>';
                    echo '</div>';
                }
            ?>
        </div>
    </div>
</div>