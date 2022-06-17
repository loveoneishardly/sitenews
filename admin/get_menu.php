<div class="sidebar-wrapper scrollbar scrollbar-inner">
    <div class="sidebar-content">
        <div class="user">
            <div class="avatar-sm float-left mr-2">
                <img src="<?php echo $_SESSION["donvi_logo"]; ?>" alt="" class="avatar-img rounded-circle">
            </div>
            <div class="info">
                <a data-toggle="collapse" href="#collapseExample" aria-expanded="true">
                    <span>
                        <?php echo $_SESSION["tennhanvien"]; ?>
                        <span class="user-level"><?php echo $_SESSION["email"]; ?></span>
                    </span>
                </a>
            </div>
        </div>
        <ul class="nav nav-primary">
            <?php echo $_SESSION["menusudung"] ?>
        </ul>
    </div>
</div>