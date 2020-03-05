const components = {};

components.main = `
    <section class="content">
        <div class="container">
            <div id="main-content" class="row">
                    <div class="col-sm-3 content-left" id="content-left">
                            
                    </div>
                    <div id="content-right" class="col-sm-9">
                        
                    </div>
                </div>
            </div>
        </div>
    </section>
`

components.formAddDocument = `
    <div class="container">
        <h3>Thông tin giáo trình</h3>
        <div class="row border padding-top">
            <div class="col-sm-2 border-right">1</div>
            <div class="col-sm-10">
                <form id="form-add-document">
                    <div style="border-bottom: 1px solid #ddd">
                        <div class="form-row" style="padding-top: 1rem;">
                            <div class="col-sm-6 mb-3">
                                <input type="text" class="form-control" name="name" placeholder="Tên giáo trình">
                                <p id="name-document" class="invalid-feedback">asdfsdafsdsdf</p>
                            </div>
                            
                            <div class="col-sm-6 mb-3">
                                <input type="text" class="form-control" name="university"
                                                    placeholder="Trường">
                                <span id="university-document" class="invalid-feedback"></span>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col-sm-6 mb-3">
                                <input type="number" class="form-control" name="condition" placeholder="Tình trạng">
                                <span id="condition-document" class="invalid-feedback"></span>
                            </div>
                            <div class="col-sm-6 mb-3">
                                <input type="number" class="form-control" name="price" placeholder="Giá">
                                <span id="price-document" class="invalid-feedback"></span>
                            </div>
                        </div>
                        <div class="form-row">
                            <div id="form-add-image" class="col-sm-6 mb-3">
                                <div class="card-add-image">
                                    <input type="file" name="image" id="fileButton" accept="image/*" />
                                </div>
                            </div>
                            <div class="col-sm-6 mb-3">
                                <textarea class="form-control" rows="3" name="describe" placeholder="Mô tả"></textarea>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary" type="submit" id="btn-add-document">Đăng</button>
                    <button class="btn btn-danger" id="main-link">Hủy</button>
                </form>
            </div>
        </div>
    </div>`

components.login = `
<div class="modal fade" id="modal-login" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content" id="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <section>
                    <div class="row">
                        <div class="col-lg-5" style="color: #495057">
                            <h2>Đăng nhập</h2>
                            <p>Đăng nhập để đăng bán sản phẩm, theo dõi sản phẩm, lưu danh sách sản phẩm đã xem,
                                sử
                                dụng nhiều chức năng</p>
                            <img src="./img/login-register-image.png" style="width: 100%;height: cover">
                        </div>
                        <div class="col-lg-7">
                            <div class="content-right__header">
                                <a class="tab-item active">
                                    Đăng nhập
                                </a>
                                <a class="tab-item" id="register">
                                    Tạo tài khoản
                                </a>
                            </div>
                            <div class="content-right__body">
                                <form id="login" onsubmit="view.login(this)">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1" style="font-weight: 500;">Email</label>
                                        <input type="email" class="form-control" name="email"
                                            placeholder="Nhập email">
                                        <span id="email-error" class="message-error"></span>
                                    </div> 
                                    <div class="form-group">
                                        <label for="exampleInputPassword1" style="font-weight: 500;">Mật
                                            khẩu</label>
                                        <input type="password" class="form-control" name="password"
                                            placeholder="Mật khẩu dài từ 6 đến 32 kí tự">
                                        <span id="password-error" class="message-error"></span>
                                    </div>
                                    <span id="login-error" class="message-error"></span>
                                    <button type="submit" class="btn btn-primary">Đăng
                                        nhập</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>`

components.register = `
<div class="modal fade" id="modal-register" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content" id="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-lg-5" style="color: #495057">
                        <h2>Tạo tài khoản</h2>
                        <p>Tạo tài khoản để đăng bán sản phẩm, theo dõi sản phẩm, lưu danh sách sản phẩm đã xem, sử dụng nhiều chức năng</p>
                        <img src="./img/login-register-image.png"/ style="width: 100%">
                    </div>
                    <div class="col-lg-7">
                        <div class="content-right__header" >
                            <a class="tab-item" id="return-login">
                                Đăng nhập
                            </a>
                            <a class="tab-item active">
                                Tạo tài khoản
                            </a>
                        </div>
                        <div class="content-right__body">
                            <form id="register-form">
                                <div class="form-group">
                                    <label for="exampleInputEmail1" style="font-weight: 500;">Họ và tên</label>
                                    <input type="text" name="fullname" class="form-control" placeholder="Nhập họ tên của bạn">
                                    <span id="fullname-error" class="message-error"></span>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1" style="font-weight: 500;">email</label>
                                    <input type="email" name="email" class="form-control" placeholder="Nhập email của bạn">
                                    <span id="email-error" class="message-error"></span>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1" style="font-weight: 500;">Số điện thoại</label>
                                    <input type="number" name="phoneNumber" class="form-control" placeholder="Số điện thoại">
                                    <span id="phoneNumber-error" class="message-error"></span>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1" style="font-weight: 500;">mật khẩu</label>
                                    <input type="password" name="password" class="form-control" placeholder="Mật khẩu dài từ 6 đến 32 kí tự">
                                    <span id="password-error" class="message-error"></span>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1" style="font-weight: 500;">Nhập lại mật khẩu</label>
                                    <input type="password" name="confirmPassword" class="form-control" placeholder="Mật khẩu dài từ 6 đến 32 kí tự">
                                    <span id="confirm-password-error" class="message-error"></span>
                                </div>
                                    <p id="register-error" class="message-error"></p>
                                    <p id="register-success" class="message-success"></p>
                                <button type="submit" id="register-btn" class="btn btn-primary">Đăng kí</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`

components.chat = `
<section class="chat-section">
        <div class="container">
            <div class="row chat-container">
                <div class="col-sm-3 chat-aside-">
                    <div class="chat-title">
                            <img id="avatar-boss" 
                                class="avatar" alt="Avatar" style="margin-right: 10px">
                            Chat
                    </div>
                    <div class="list-conversation" id="list-conversation">
                        
                    </div>
                </div>
                <div class="col-sm-9">
                    <div class="list-message" id='list-message'>
                    </div>
                    <form class="form-add-message" id="form-add-message">
                        <div class="input-wrapper">
                            <input type='text' name="message" class="inputMessage" placeholder="Enter your message">
                        </div>
                        <button type="submit" id="form-add-message-btn" class="buttonMessage">Send</button>
                    </form>
                </div>
            </div>
        </div>
    </section>`

components.navBarNoActive = `
<section>
        <div class="mynav">
            <div class="container">
                <div class="row">
                    <div class="col-sm-2">
                        <img src="img/logo.png" alt="logo" class="logo" id="logo" onclick="view.showComponents('main')"/>
                    </div>
                    <div class="col-sm-6 nav-center">
                    <form id="search">
                    <div class="input-group mb-3">
                        <input id="search-input" type="text" onsubmit="" class="form-control" style="width: 300px"
                            placeholder="Tìm kiếm giáo trình mong muốn...">
                        <div class="input-group-append">
                            <button class="btn btn-outline-light" type="submit" id="search-button" onclick="view.search()"><i
                                    class="fas fa-search"></i></button>
                        </div>
                    </div>
                </form>
                    </div>
                    <div class="col-sm-4">
                        <div class="nav-right" id="nav-right">
                            <button type="button" class="btn btn-outline-success" onclick="view.showComponents('login')" id="nav-for-sale-btn">Đăng bán</button>
                            <button type="button" class="btn btn-outline-primary" onclick="view.showComponents('login')" id="nav-signin-btn">Đăng nhập</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>`

components.productDetails = `
<section class="product-details">
<div class="container product-details-content" >
  <button type="button" class="btn btn-primary" id="btn-back"> <i class="fas fa-chevron-"></i> Quay lại</button>
  <div class="row product-details-content-row">
    <div class="col-sm-8">
      <h4>Thông tin sản phẩm</h4>
      <div id="tableShowDetailProduct">

      </div>
    </div>
    <div class="col-sm-4">
      <button type="button" class="btn btn-success" id="btn-show-contact-infor">Click để lấy thông tin liên
        hệ</button>
      <div id="contactInfor" style="padding-top: 10px;"></div>
    </div>
  </div>
</div>
</section>`

components.footer = `
<section class="footer">
        <div class="container">
            <div class="footer-top">
                <div class="footer-top-left">
                    <span onclick="view.toAdmin('Admin')">Giúp đỡ</span>
                    <span onclick="view.toAdmin('Báo lỗi')">Báo lỗi</span>
                    <span onclick="view.toAdmin('Góp ý')">Góp ý</span>
                </div>
            </div>
            <div class="footer-bottom">
                <span>Đội ngũ phát triển: 3T Team</span>
            </div>
        </div>
    </section>
    <div  id='modal-compare' class="modal fade bd-example-modal-xl" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
        <div class="modal-header">
             <h5 class="modal-title" id="exampleModalLabel"></h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
             </button>
        </div>
        <div id='infor-compare' class='modal-body'>
      </div>
      
    </div>
  </div>
</div>
`

components.personalInformation = `
<section class="profile">
        <div class="container">
            <div class="row">
                <div class="col-sm-3 profile-left">
                    <h5>Cá nhân</h5>
                    <div class="profile-left-tab" id="profile-left-tab">
                        
                    </div>
                </div>
                <div class="col-sm-9 profile-right" id="profile-right">
                    
                </div>
            </div>
        </div> 
        <div class="modal fade" id="modalNewPhoneNumber" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <form id="formUpdateNewPhoneNumber">
                            <div class="form-group">
                                <input type="number" class="form-control" name="newPhoneNumber" aria-describedby="emailHelp" placeholder="Nhập số điện thoại mới">
                              </div>
                              <span id="change-phone-number-error"></span>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalNewAvatar" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                    <form id="form-change-avatar">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" name="image" accept="image/*">
                            <label class="custom-file-label" for="inputGroupFile02" aria-describedby="inputGroupFileAddon02">Choose file</label>
                        </div>
                        <button type="submit" class="btn btn-primary">Đổi</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
        
    </section>`

components.store = `
<section class="profile">
        <div class="container">
            <div class="row">
                <div class="col-sm-3 profile-left">
                    <h5>Cá nhân</h5>
                    <div class="profile-left-tab" id="store-left-tab">
                        
                    </div>
                </div>
                <div class="col-sm-9 profile-right">
                    <button type="button" class="btn btn-primary"
                        data-toggle="modal" data-target="#modal-add-document">
                        Đăng bán
                    </button>
                    <div id="store-right">
                        <section id="store-right-selling">
                        </section>
                        <section id="store-right-sold">
                        </section>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modal-add-document" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <h3>Thông tin giáo trình</h3>
                        <div class="row border padding-top">
                            <div class="col-sm-12">
                                <form id="form-add-document">
                                    <div style="border-bottom: 1px solid #ddd">
                                        <div class="form-row" style="padding-top: 1rem;">
                                            <div class="col-sm-6 mb-3">
                                                <input type="text" class="form-control" name="name" placeholder="Tên giáo trình">
                                                <span id="name-document" class="message-error"></span>
                                            </div>
                                            <div class="col-sm-6 mb-3">
                                            <select class="custom-select" name="university" >
                                            <option value="Kinh tế quốc dân">Kinh tế quốc dân</option>
                                            <option value="Bách khoa Hà Nội">Bách khoa Hà Nội</option>
                                            <option value="Công đoàn">Công đoàn</option>
                                            <option value="Công nghệ giao thông vận tải">Công nghệ giao thông vận tải</option>
                                            <option value="Tài nguyên và môi trường">Tài nguyên và môi trường</option>
                                            <option value="Công nghiệp">Công nghiệp</option>
                                            <option value="Dược Hà Nội">Dược Hà Nội</option>
                                            <option value="Điện lực">Điện lực</option>
                                            <option value="Giao thông vận tải">Giao thông vận tải</option>
                                            <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                                            <option value="Khoa học xã hội và nhân văn">Khoa học xã hội và nhân văn</option>
                                            <option value="Kiến trúc">Kiến trúc</option>
                                            <option value="Fpt">Fpt</option>
                                            </select> 
                                            <span id="university-document" class="message-error"></span>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-sm-6 mb-3">
                                                <input type="number" class="form-control" name="condition" placeholder="Tình trạng">
                                                <span id="condition-document" class="message-error"></span>
                                            </div>
                                            <div class="col-sm-6 mb-3">
                                                <input type="number" class="form-control" name="price" placeholder="Giá">
                                                <span id="price-document" class="message-error"></span>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div id="form-add-image" class="col-sm-6 mb-3">
                                                <div class="card-add-image">
                                                    <input type="file" name="image" id="fileButton" accept="image/*" />
                                                </div>
                                            </div>
                                            <div class="col-sm-6 mb-3">
                                                <textarea class="form-control" rows="3" name="describe" placeholder="Mô tả"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <button id="btn-add-document" class="btn btn-primary" type="submit">Đăng</button>
                                    <button id="main-link" class="btn btn-danger" id="main-link">Hủy</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modal-fix-document" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <h3>Thông tin giáo trình</h3>
                            <div class="row border padding-top">
                                <div class="col-sm-12">
                                    <form id="form-fix-document">
                                        
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
</section>`

components.loading = `<div class="loading">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>`