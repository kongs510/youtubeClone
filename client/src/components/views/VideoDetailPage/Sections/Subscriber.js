import Axios from "axios";

import React, { useEffect, useState } from "react";

function Subscriber(props) {
  const userTo = props.userTo;
  const userFrom = props.userFrom;

  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  const onSubscribe = () => {
    let subscribeVariables = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };
    console.log(Subscribed);
    console.log(subscribeVariables);
    if (Subscribed) {
      //구독중일때
      Axios.post("/api/subscribe/unSubscribe", subscribeVariables).then(
        (response) => {
          if (response.data.success) {
            console.log(response.data.success + "1");
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert("Failed to unsubscribe");
          }
        }
      );
    } else {
      // 아직 구독중이 아닐때
      Axios.post("/api/subscribe/subscribe", subscribeVariables).then(
        (response) => {
          if (response.data.success) {
            console.log(response.data.success + "2");
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert("Failed to subscribe");
          }
        }
      );
    }
  };

  useEffect(() => {
    const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom };
    Axios.post("/api/subscribe/subscribeNumber", subscribeNumberVariables).then(
      (response) => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber);
        } else {
          alert("구독자수 가져오기를 실패합니다.");
        }
      }
    );
    Axios.post("/api/subscribe/subscribed", subscribeNumberVariables).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subcribed);
        } else {
          alert("구독자 정보를 얻는데 실패했습니다.");
        }
      }
    );
  }, []);
  return (
    <div>
      <button
        onClick={onSubscribe}
        style={{
          backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
      >
        {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default Subscriber;
