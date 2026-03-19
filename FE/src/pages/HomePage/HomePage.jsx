import React from "react";
import img1 from "../../assets/img1.png";
import CardMemberSection from "../../components/cardMember/cardMember";
import "./HomePage.scss";

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__media">
          <img src={img1} alt="Supportive quit smoking journey" />
        </div>

        <div className="home-hero__content">
          <h1>Take care, love yourself</h1>
          <p>
            Quitting smoking is an important step in taking care of your
            health. When you quit smoking, your body will gradually recover,
            improve lung function and strengthen your immune system. At the
            same time, your skin will become brighter and healthier and reduce
            the risk of serious diseases such as cancer and cardiovascular
            disease.
          </p>
        </div>
      </section>

      <section className="home-intro">
        <h2>Who we are ?</h2>
        <p>
          We are a smoking cessation support platform, helping you quit in a
          disciplined, responsible way and having a coach to accompany you
          during the smoking cessation process.
        </p>
      </section>

      <CardMemberSection />
    </div>
  );
};

export default HomePage;
