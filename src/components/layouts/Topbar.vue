<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="collapse navbar-collapse" id="Navbar">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <a class="nav-link active" riaa-current="page" href="#">プロフィール</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" riaa-current="page" href="#">コミュニティ一覧</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" riaa-current="page" href="#">コミュニティ作成</a>
            </li>
          </ul>
          <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="検索..." aria-label="検索...">
            <button class="btn btn-outline-success flex-shrink-0" type="submit">検索</button>
          </form>
        </div>
      
    </nav>
  </header>
</template>

<style>
.container {
  max-width: 960px;
}

.site-header {
  background-color: rgba(0, 0, 0, .85);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}

.site-header a {
  color: #8e8e8e;
  transition: color .15s ease-in-out;
}

.site-header a:hover {
  color: #fff;
  text-decoration: none;
}

</style>
