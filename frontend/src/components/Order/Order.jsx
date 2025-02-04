import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Order.css";
import items from "./items.json";

export default function Order() {
  const [searchResult, setSearchResult] = useState(items.items);
  const [search, setSearch] = useState("");
  const SPOONCULAR_API_KEY = import.meta.env.VITE_APP_SPOONCULAR;
  const handleOnSearch = async (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      alert("emply text field");
      return;
    }
    let response = await fetch(
      `https://api.spoonacular.com/food/menuItems/search?query=${search}&apiKey=${SPOONCULAR_API_KEY}`
    );
    let data = await response.json(); // Parse the JSON
    setSearchResult(data?.menuItems);
    console.log(data?.menuItems);
  };
  return (
    <div className="orderpage">
      <Form className="searchbar" onSubmit={handleOnSearch}>
        <Form.Control
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search your item"
          required
        />
        <Button type="submit" variant="warning">
          <i className="bi bi-search"></i>
        </Button>
      </Form>
      <Container className="search-result">
        {searchResult.map((item, index) => (
          <Card key={index} className="result-card">
            <Card.Img variant="top" src={item.image} />
            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>{item.restaurantChain}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
}
