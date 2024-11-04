import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 24;
const Home = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalpages, setTotalPages] = useState(0);
  const [errorMSG, setErrorMsg] = useState('');

  const fetchImages = useCallback(async () =>{
    try {
      if(searchInput.current.value ){
        setErrorMsg('');
        const {data} = await axios.get(`${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_API_KEY}`);
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later");
      console.log(error)
    }
  },[page]);

  useEffect(() =>{
    fetchImages();
  },[fetchImages]);

  const handleSearch = (event) =>{
    event.preventDefault();
    console.log(searchInput.current.value);
    setPage(1);
    fetchImages();
  };
  return (
    <div className='container'>
      <h1 className='title'>Image search</h1>
      {errorMSG && <p className='error-msg'>{errorMSG}</p>}
      <div className='search-section'>
        <Form onSubmit={handleSearch}>
          <Form.Control type="search" placeholder="Type something to search" className='search-input' ref={searchInput}/>
        </Form>
      </div>
      <div className='images'>
        {images.map((image) =>(
          <img key={image.id} src={image.urls.small} alt={image.alt_description}  className='image'/>
        ))}
      </div>

      <div className='buttons'>
        {page > 1 && <Button onClick={()=> setPage(page -1)}>Previous</Button>}
        {page < totalpages  && <Button onClick={()=> setPage(page +1)}>Next</Button>}
      </div>

    
    </div>
  );
};

export default Home;