import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../axiosInstance';
import { Button, Form } from 'react-bootstrap';
import './Toss.css';
import { useNavigate } from 'react-router-dom';

const Payco = ( {userInfo, setUserInfo} ) => {

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);
  
  const tdStyle = {
    padding: '10px', 
    fontWeight : 'bold'
  };

  const thStyle = {
    padding : '10px',
    fontWeight : 100
  };

  const [money, setMoney] = useState(userInfo.mileage);

  const navigate = useNavigate();

  const requestPay = () => {

    const d = document.querySelector('.mileage').value;

    const oriMoney = parseInt(money);
    const chargeMoney = parseInt(d);
    const totalMoney = oriMoney + chargeMoney;

    setMoney(totalMoney);
    console.log(totalMoney);

    const { IMP } = window;
    IMP.init('imp43772371');

    IMP.request_pay({
      pg: 'payco',
      pay_method: 'card',
      merchant_uid: new Date().getTime(),
      name: '테스트 상품(payco)',
      amount: d,
      buyer_email: 'test@naver.com',
      buyer_name: 'test2',
      buyer_tel: '010-1234-5678',
      buyer_addr: '서울특별시',
      buyer_postcode: '123-456',
    }, async (rsp) => {
      try {
        const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/verifyIamport/` + rsp.imp_uid);
        console.log(data)
        if (rsp.paid_amount === data.response.amount) {
          axiosInstance.post('/payCultureland', {id : "test2" , userInfo:userInfo, mileage: totalMoney})
          .then(response => {
              alert(response.data);
              console.log("마일리지 충전 완료");
              setUserInfo({...userInfo, mileage : totalMoney});
              navigate('/');
            }).catch(error => {
              console.log(error);
            });
          alert('결제 성공');
        } else {
          alert('결제 실패');
        }
      } catch (error) {
        console.error('Error while verifying payment:', error);
        console.log(rsp.paid_amount)
        alert('결제 실패');
      }
    });
  };


  return (
    <div className='payMain'>
      <div>
        <h4>페이코</h4>
        <hr></hr>
        <table>
          <tbody>
            <tr>
              <td style={tdStyle}>마일리지 종류</td>
              <th style={thStyle}>구매전용 마일리지 (출금불가)</th>
            </tr>
            <tr>
              <td style={tdStyle}>충전 수수료</td>
              <th style={thStyle}>0%</th>
            </tr>
            <tr>
              <td style={tdStyle}>충전 한도</td>
              <th style={thStyle}>페이코 결제 한도 확인 </th>
            </tr>
          </tbody>
        </table>
        <ul className="tossReadme">
        </ul>
      </div>
      <hr></hr>
      <table>
        <tbody>
          <tr>
            <td style={tdStyle}>보유중인 마일리지</td>
            <th style={thStyle}>{userInfo.mileage}원</th>
          </tr>

          <tr>
            <td style={tdStyle}>충전신청금액</td>
            <th style={thStyle}><Form.Control type="text" className="mileage" placeholder="1,000원 이상 결제가능"/></th>
          </tr>
        </tbody>
      </table>
      <hr></hr>
      <div style={{textAlign : "center"}}>
      <Button className="payReq" onClick={requestPay}>충전신청</Button>
      </div>
    </div>
  );
};

export default Payco;