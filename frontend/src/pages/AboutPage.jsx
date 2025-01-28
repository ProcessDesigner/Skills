import React from 'react';
import '../assets/Team.css';
import { Link } from 'react-router-dom';
import sahas from "../assets/Sahas.png"
import aryaan from "../assets/Aryaan.jpeg.jpg"

import 'bootstrap-icons/font/bootstrap-icons.css';
const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Sahas Prajapati',
      role: 'Developer',
      description: 'Passionate developer creating seamless and engaging digital experiences.',
      image: sahas,
      socials: {
        instagram: 'https://www.instagram.com/sahas.prajapati',
        linkedin: 'https://www.linkedin.com/in/sahasprajapati/',
        github: 'https://github.com/SahasOP/',
      },
    },
    {
      name: 'Aryaan Gala',
      role: 'Developer',
      description: 'Enthusiastic developer dedicated to developing dynamic web experiences.',
      image: aryaan,
      socials: {
        instagram: 'https://www.instagram.com/aryaan.gala',
        linkedin: 'https://www.linkedin.com/in/aryaangala/',
        github: 'https://github.com/AryaanGala1406/',
      },
    },
  ];

  return (
    <section id="team" className="team section light-background">
      <div className="container section-title">
        <h2>Our Team</h2>
        <p>Meet the professionals who drive our mission forward</p>
        <Link to="/" className="home-button">Home</Link>
      </div>

      <div className="container team-cards">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <div className="team-card-inner">
              <div className="team-card-front">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-card-back">
                <div className="member-img-back">
                  <img src={member.image} alt={member.name} />
                </div>
                <h4 className='back-name' >{member.name}</h4>
                <span className='back-role'>{member.role}</span>
                <p>{member.description}</p>
                <div className="social">
                  <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a>
                  <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin"></i></a>
                  <a href={member.socials.github} target="_blank" rel="noopener noreferrer"><i className="bi bi-github"></i></a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutPage;
