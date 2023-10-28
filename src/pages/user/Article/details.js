import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./article.css";
import { Container } from "reactstrap";
import LoadingDot from "~/components/Loading/LoadingDot";
import { GrFormNext } from "react-icons/gr";
import http from "~/utils/httpUser";
import config from "~/router/config";
import { AiFillEye } from "react-icons/ai";
const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name_category, setNameCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [articles_realted, setArticlesRealted] = useState([]);
  const [hospitals, setHospitals] = useState([])
  const [article, setArticle] = useState({
    id: null,
    id_user: null,
    id_category: null,
    title: "",
    content: "",
    thumbnail: "",
    search_number: null,
    is_accept: null,
    is_show: null,
    created_at: "",
    updated_at: "",
    name: "",
    id_article: null,
    thumbnail_article: "",
    thumbnail_categorie: "",
    search_number_article: null,
    created_at_article: null,
    created_at_category: null,
    updated_at_article: "",
    updated_at_category: "",
    name_user: null,
    role_user: null,
    avatar_user: null,
    name_category: "",
  });

  useEffect(() => {
    const getArticle = async () => {
      try {
        setLoading(true);
        const response = await http.get("/article/detail/" + id);
        setArticle(response.data.data);
        setNameCategory(response.data.data.name_category);
      } catch (error) {
        if(error.response.data.status == 404 ) {
            navigate("/page-not-found");
        }
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, [id]);

  useEffect(() => {
		if(name_category!=null && name_category!= "") {
      const getListArticleRelated = async () => {
        try {
          const response = await http.get('/article?name_category='+name_category);
          setArticlesRealted(response.data.data);
        } catch (error) {
          console.log('Lỗi kết nối đến API !', error);
        } finally {
          setLoading(false)
        }
      }
      getListArticleRelated()
    }
	}, [name_category]);

  useEffect(() => {
    const getHospitals = async () => {
       try {
          const queryParams = `?page=1&paginate=5&sort_search_number=true`
          const response = await http.get(
             'infor-hospital/all-hospital' + queryParams
          )
          setHospitals(response.data.data.data)
       } catch (error) {
          console.log('Lỗi kết nối đến API !', error)
       }
    }
    getHospitals()
 }, [])

  useEffect(() => {
    if (name_category != null && name_category != "") {
      const getListArticle = async () => {
        try {
          const response = await http.get(
            "/article?&page=1&paginate=7&sort_search_number=true"
          );
          setArticles(response.data.data.data);
        } catch (error) {
          console.log("Lỗi kết nối đến API !", error);
        } finally {
          setLoading(false);
        }
      };
      getListArticle();
    }
  }, [name_category]);
  return (
    <>
      {loading && <LoadingDot />}
      <div className="header-hospital">
        <div className="breadcrumb">
          <Container className="d-flex">
            <div className="first-link">
              <Link>{article.name_category}</Link>
            </div>
            <div className="between">
              <GrFormNext />
            </div>
            <div className="second-link">
              <Link>{article.title}</Link>
            </div>
          </Container>
        </div>
      </div>
      <Container className="main-hospital">
        <div>
          <div className="banner">
            <div className="thumbnail-cover">
              <div className="thumbnail">
                <div className="grid-layout">
                  <img
                    src={config.URL + article.thumbnail_article}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container className="main-article mt-5">
        <div className="row w-100">
          <div className="col-md-8 col-lg-8">
            <div className="header-article">
              <div className="category">
                <button className="btn-category">
                  <div className="content">
                    <span className="image">
                      <img src={config.URL + article.thumbnail_categorie} />
                    </span>
                    <span className="name">{article.name_category}</span>
                  </div>
                </button>
              </div>
              <div className="name-article">
                <h1>{article.title}</h1>
                <p>
                  <AiFillEye /> Lượt xem: {article.search_number}
                </p>
              </div>
              <div className="content-article">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              <hr className="mt-5"/>
              <div className="related-article">
                <p className="mb-0 mt-4">bài viết liên quan</p>
                <div className="list-related">
                  {articles_realted.map((item,index) => {
                    if (item.id_article != article.id_article) {
                      return (
                    <Link to={"/article/" + item.id_article} key={index}><h3>- {item.title}</h3></Link>
                    );
                    }
                  })}
                </div>
              </div>
              <hr className="mt-4"/>
            </div>
          </div>
          <div className="col-md-4 col-lg-4">
            <div className="right-component w-100">
              <div className="author">
                <div className="expert">
                  <Link>
                    <div className="avatar-author">
                      <img
                        src={
                          article.avatar_user === null
                            ? "/image/avatar_admin_default.png"
                            : config.URL + article.avatar_user
                        }
                      />
                    </div>
                  </Link>
                </div>
                <div className="information">
                  <p>Thông tin được đăng tải bởi:</p>
                  <Link>
                    <p className="title">
                      {article.name_user === null ? "Admin" : article.name_user}
                    </p>
                  </Link>
                </div>
                <hr />
                <div className="footer-author">
                  <p>
                    Ngày cập nhật: <b>{article.updated_at_article}</b>
                  </p>
                </div>
              </div>
              <hr />
              <div className="list-article">
                <div className="list-title">
                  <h3 className="">Các bài viết nổi bật</h3>
                </div>
                <div className="list">
                  {articles.map((item, index) => {
                    if (item.id_article != article.id_article) {
                      return (
                        <div key={index} className="list-item">
                          <div className="thumbnail">
                            <img src={config.URL + item.thumbnail_article} />
                          </div>
                          <div className="item-infor">
                            <div className="name-article">
                              <p>{item.title}</p>
                            </div>
                            <div className="name-category">
                              <p>{item.name_category}</p>
                            </div>
                            <p className="view-more">
                              <Link to={"/article/" + item.id_article}>
                                Xem ngay
                              </Link>
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                <hr/>
               
              </div>
              <div className="list-article">
                <div className="list-title">
                  <h3 className="">Bệnh viện nổi bật</h3>
                </div>
                <div className="list">
                  {hospitals.map((hospital, index) => {
                      return (
                        <div key={index} className="list-item">
                          <div className="thumbnail">
                            <img src={hospital.avatar ? config.URL + hospital.avatar : "/image/default-hospital-search.jpg"} />
                          </div>
                          <div className="item-infor">
                            <div className="name-article">
                              <p>{hospital.name}</p>
                            </div>
                            <div className="name-category">
                              <p>{hospital.address}</p>
                            </div>
                            <p className="view-more">
                              <Link to={'/hospital/' + hospital.id_hospital}>
                                Đặt lịch khám
                              </Link>
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ArticleDetail;
