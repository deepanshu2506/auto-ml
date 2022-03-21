import styles from "./styles.module.scss";
import React, { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import {
  Col, Container, Row, Spinner, Form, InputGroup, Card,
} from "react-bootstrap";

export const Gallery = props => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const data = [
    { thumb: "img/portfolio/01-small.png", title: "Upload your dataset" },
    { thumb: "img/portfolio/02-small.png", title: "Connect to your SQL database" },
    { thumb: "img/portfolio/03-small.png", title: "Check all uploaded datasets" },
    { thumb: "img/portfolio/04-small.png", title: "Dataset Preview" },
    { thumb: "img/portfolio/05-small.png", title: "Perform aggregation" },
    { thumb: "img/portfolio/06-small.png", title: "Auto imputation" },
    { thumb: "img/portfolio/07-small.png", title: "Auto visualization" },
    { thumb: "img/portfolio/08-small.png", title: "Auto model selection" },
    { thumb: "img/portfolio/07-small.jpg", title: "Generate Readme" },
  ];

  const images = data.map(obj => obj.thumb.replace("-small", "-large"));

  const openImageViewer = useCallback(index => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div id="portfolio" className={`${styles.portfolio} text-center`}>
      <Container>
        <div className={styles.sectionTitle}>
          <h2>Sneak Peek of data-genie</h2>
          <p>Data Genie will fulfil all your data wishes .Be it getting data insights, aggregating, generating readme and automating imputation ,visulization and even model selection.</p>
        </div>
        <Row>
          {/* <div className="portfolio-items"> */}
            {data.map(({ title, thumb }, index) => (
              <Col key={index} onClick={() => openImageViewer(index)} sm={6} md={4} lg={4}>
                <div className={`${styles.portfolioItem} cursor`}>
                  <div className={styles.hoverBg}>
                    <div className={styles.hoverText}>
                      <h4>{title}</h4>
                    </div>
                    <div></div>
                    <img src={thumb} className="img-responsive" alt="Project Title" />{" "}
                  </div>
                </div>
              </Col>
            ))}
          {/* </div> */}

          {isViewerOpen && (
            <ImageViewer
              src={images}
              backgroundStyle={{ zIndex: 99999 }}
              currentIndex={currentImage}
              onClose={closeImageViewer}
            />
          )}
        </Row>    
    </Container>
    </div>
  );
};
