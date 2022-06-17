<div class="row justify-content-between align-items-end mb-15">
    <div class="col-xl-4">
        <div class="section-tittle mb-30">
            <h3>Tin Mới</h3>
        </div>
    </div>
    <div class="col-xl-8 col-md-9">
        <div class="properties__button">                              
            <nav>                                                 
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <?php
                        foreach ($tabnews as $keynews) {
                            echo '<a class="nav-item nav-link '.$keynews['active'].'" id="'.$keynews['idtab'].'" data-toggle="tab" role="tab" href="#'.$keynews['linktab'].'" aria-controls="'.$keynews['linktab'].'" aria-selected="false">'.$keynews['nametab'].'</a>';
                        }
                    ?>
                </div>
            </nav>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <div class="tab-content" id="nav-tabContent">
            <?php
                foreach ($tabchild_card as $keynews) {
                    echo '<div class="tab-pane fade show '.$keynews['active'].'" id="'.$keynews['linktab'].'" role="tabpanel" aria-labelledby="'.$keynews['idtab'].'">';
                        echo '<div class="row">';
                            echo '<div class="col-xl-6 col-lg-12">';
                                echo '<div class="whats-news-single mb-40 mb-40">';
                                    echo '<div class="whates-img">';
                                        echo '<img src="'.$keynews['avatar'].'" alt="">';
                                    echo '</div>';
                                    echo '<div class="whates-caption">';
                                        echo '<h4><a href="go?check=_detail">'.$keynews['title'].'</a></h4>';
                                        echo '<span>by '.$keynews['name_user'].' - '.$keynews['created_at'].'</span>';
                                        echo '<p>'.$keynews['description'].'</p>';
                                    echo '</div>';
                                echo '</div>';
                            echo '</div>';
                            echo '<div class="col-xl-6 col-lg-12">';
                                echo '<div class="row">';
                                    echo '<div class="col-xl-12 col-lg-6 col-md-6 col-sm-10">';
                                        echo '<div class="whats-right-single mb-20">';
                                            $db = ConnectDb::getInstance()->getConnection();
                                            $madonvi = '1';
                                            $stmt = $db->prepare("call p_tabchild_card_right(:madonvi, :tabchil_parent);");
                                            $stmt -> bindParam(':madonvi', $madonvi, PDO::PARAM_STR);
                                            $stmt -> bindParam(':tabchil_parent', $keynews['id'], PDO::PARAM_STR);
                                            $stmt -> execute();
                                            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                                echo '<div class="whats-right-img">';
                                                    echo '<img src="'.$row['avatar'].'" alt="">';
                                                echo '</div>';
                                                echo '<div class="whats-right-cap">';
                                                    echo '<span class="colorb">'.$row['name'].'</span>';
                                                    echo '<h4><a href="latest_news.php">'.$row['title'].'</a></h4>';
                                                    echo '<p>'.$row['created_at'].'</p>';
                                                echo '</div>';
                                            }   
                                        echo '</div>';
                                    echo '</div>';
                                echo '</div>';
                            echo '</div>';
                        echo '</div>';
                    echo '</div>';
                }
            ?>
        </div>
    </div>
</div>