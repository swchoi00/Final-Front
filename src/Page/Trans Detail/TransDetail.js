import { useEffect, useState } from 'react';
import './TransDetail.css';
import axiosInstance from '../../axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import bronze from '../../Page/MyPage/Tier/bronze.png';
import silver from '../../Page/MyPage/Tier/silver.png';
import gold from '../../Page/MyPage/Tier/gold.png';
import diamond from '../../Page/MyPage/Tier/diamond.png';
import platinum from '../../Page/MyPage/Tier/platinum.png';

const TransDetail = ({ trans, userInfo, setStartTransInfo, startTransInfo, setTransDetails, isAuth }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transDetail, setTransDetail] = useState({
    id: id,
    title: '',
    content: '',
    game: '',
    server: '',
    member: '',
    price: ''
  });

  console.log(userInfo.mileage)

  const getTier = () => {
    if (transDetail.member.transactionPoints > 300) {
      return platinum; // 이미지 파일의 경로를 반환
    } else if (transDetail.member.transactionPoints > 100) {
      return diamond; // 이미지 파일의 경로를 반환
    } else if (transDetail.member.transactionPoints > 50) {
      return gold; // 이미지 파일의 경로를 반환
    } else if (transDetail.member.transactionPoints >= 5) {
      return silver; // 이미지 파일의 경로를 반환
    } else {
      return bronze; // 이미지 파일의 경로를 반환
    }
  };

  const getTierValue = () => {
    if (transDetail.member.transactionPoints > 300) {
      return "챌린저";
    } else if (transDetail.member.transactionPoints > 100) {
      return "다이아몬드";
    } else if (transDetail.member.transactionPoints > 50) {
      return "골드";
    } else if (transDetail.member.transactionPoints >= 5) {
      return "실버";
    } else {
      return "브론즈";
    }
  };


  const changeHandler = (e) => {
    setTransDetail({
      ...transDetail,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    axiosInstance.get(`/transDetail/${id}`)
      .then((response) => {
        setTransDetail(response.data);
        setTransDetails(response.data);
        setStartTransInfo(startTransInfo => ({
          ...startTransInfo,
          ...response.data
        }));
        console.log(trans)
        console.log(userInfo)

      }).catch((error) => {
        console.log(error);
      })
  }, [])

  console.log("trans : " + trans);
  console.log("transDetail : " + transDetail)

  const isDisabled = trans.member.username !== transDetail.member.username;


  const startTransHandler = () => {
    if (userInfo.mileage >= transDetail.price) {
      axiosInstance.post('/startTrans', { startTransInfo: startTransInfo, sellerId: transDetail.member.username, buyerId: userInfo.username, postId: id, transDetail: transDetail })
        .then(response => {
          alert(response.data);
          console.log('구매요청 완료');
          console.log(startTransInfo);
          setStartTransInfo({ sellerId: startTransInfo.member.username, buyerId: userInfo.username, postId: id, transDetail: transDetail })
          navigate('/mypage');
        }).catch(error => {
          console.log(error);
        })
    } else if(!isAuth){
      alert("로그인 후 이용가능합니다.")
      navigate('/login-page')
    } else {
      alert("마일리지가 부족합니다")
      navigate('/mileage')
    }

  }

  return (
    // 로그인한 사람과 작성자가 같지 않으면 disabled 조건 걸기
    // 같으면 수정삭제 버튼 보이게 하기???
    
    <div className="TransDetail">
      <br></br>
      <div className='firstLayout'>
        <Card style={{ width: '15rem', height: '212px' }}>
          <Card.Img variant="top" src={getTier()} className='gradeImg' />
          <Card.Body>
            <Card.Title className='grade'>{getTierValue()}</Card.Title>
            <Card.Text>
              {transDetail.member.name}님
            </Card.Text>
          </Card.Body>
        </Card>

        <table className='itemTable'>
          <tbody>
            <tr>
              <th>제목</th>
              <td><input type="text" defaultValue={transDetail.title} className='tableLeft' name='title' onChange={changeHandler} disabled={isDisabled} /></td>
            </tr>
            <tr>
              <th>게임</th>
              <td><input type="text" defaultValue={transDetail.game} className='tableLeft' name='game' onChange={changeHandler} disabled /></td>
            </tr>
            <tr>
              <th className='bottom'>서버</th>
              <td><input type="text" defaultValue={transDetail.server} className='tableLeft' name='server' onChange={changeHandler} disabled /></td>
            </tr>
          </tbody>
        </table>
      </div>
      {
        trans.member.username === transDetail.member.username ?
          <>
            <div className='write'>
              <div className='writeBtn'>
                <button className='updateBtn' onClick={() => {
                  axiosInstance.put('/updateTrans', transDetail)
                    .then(response => {
                      alert(response.data);
                      navigate('/transPost');
                    }).catch(error => {
                      console(error);
                      console(transDetail);
                    })
                }}>수정</button>
                <button className='deleteBtn' onClick={() => {
                  axiosInstance.delete(`/deleteTrans/${id}`)
                    .then(response => {
                      alert(response.data);
                      navigate('/transPost');
                    }).catch(error => {
                      console.log(error);
                    })
                }}>삭제</button>
              </div>
              <p>* 수정하시고 수정버튼 누르시면 됩니다.</p>
            </div>
          </>
          : <div />
      }
      <div className='secondLayout'>
        <h2> · 상세내용</h2>
        <div>
          <textarea defaultValue={transDetail.content} name='content' onChange={changeHandler} disabled={isDisabled}></textarea>
        </div>
      </div>
      <div className='thirdLayout'>
        <h2>결제금액</h2>
        <span>총 결제금액
          <input type='text' defaultValue={transDetail.price.toLocaleString('ko-KR')} className='totalPrice' name='price' onChange={changeHandler} disabled={isDisabled} />원
        </span>
      </div>
      <div className='detailBtn'>
        <button className='cancel' onClick={() => {
          navigate('/transPost');
        }}>취소</button>
       {trans.member.username !== null && trans.member.username !== transDetail.member.username && transDetail.trans === "READY" &&  (
          <button className='buy' onClick={startTransHandler}>구매요청</button>
        )}
      </div>
    </div>
  )
}

export default TransDetail;