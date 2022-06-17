<div class="weekly3-news-active dot-style d-flex">
    <?php
        $db = ConnectDb::getInstance()->getConnection();
        $madonvi = '1';
        $typenews = '7';
        $stmt = $db->prepare("call p_gettrending_news(:madonvi, :typenews);");
        $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
        $stmt -> bindParam(':typenews', $typenews, PDO::PARAM_STR);
        $stmt -> execute();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo '<div class="weekly3-single">';
                echo '<div class="weekly3-img">';
                    echo '<img src="'.$row['avatar'].'" alt="">';
                echo '</div>';
                echo '<div class="weekly3-caption">';
                    echo '<h4><a href="#">'.$row['title'].'</a></h4>';
                    echo '<p>'.$row['created_at'].'</p>';
                echo '</div>';
            echo '</div>';
        }
    ?>
</div>