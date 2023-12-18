import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import "./MessagesHome.css";
import PageView from "../PageView/PageView";

interface Message {
  id: number;
  senderNickname: string;
  receiverNickname: string;
  content: string;
  date: string;
}

const MessagesHome = () => {
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [showSent, setShowSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      // Fetch sent messages
      const sentResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/me/send`,
        { headers: { Authorization: `${localStorage.getItem("Authorization")}` }}
      );
      setSentMessages(sentResponse.data.messages);

      // Fetch received messages
      const receivedResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/me/receive`,
        { headers: { Authorization: `${localStorage.getItem("Authorization")}` }}
      );
      setReceivedMessages(receivedResponse.data.messages);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <PageView isLoading={isLoading}>
      <div className="messages-home">
        <h2>{(showSent ? "Sent Messages": "Received Messages")}</h2><br></br>
        <div className="toggle-button-container">
          <button className="toggle-button" onClick={() => setShowSent(!showSent)}>
            {showSent ? "Show Received Messages" : "Show Sent Messages"}
          </button>
        </div>

        <div className="messages-list">
          {(showSent ? sentMessages : receivedMessages).map((message) => (
            <Card key={message.id} className="message-card">
              <Card.Body>
                <Card.Title>
                  {showSent ? "To: " + message.receiverNickname : "From: " + message.senderNickname}
                </Card.Title>
                <Card.Text>{message.content}</Card.Text>
                <Card.Footer>
                  <small className="text-muted">
                    {new Date(message.date).toLocaleString()}
                  </small>
                </Card.Footer>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </PageView>
  );
};

export default MessagesHome;
