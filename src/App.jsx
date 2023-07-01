import { useEffect, useState } from 'react'
import './style.css'
import axios from 'axios'

//Table
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import ReactPaginate from "react-paginate";

//FA
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

//Modal
import Swal from 'sweetalert2'
import ModalContent from './Components/Modal/Modal'
import ViewDetailModal from './Components/Modal/ViewDetailModal'

import { Form } from 'react-bootstrap';

function App() {
  const [houses, setHouses] = useState([]);
  const [postCode, setPostCode] = useState([]);
  const [postCodeDetail, setPostCodeDetail] = useState();

  //Table
  const [itemOffset, setItemOffset] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  //modal
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const [showDetail, setShowDetail] = useState(false);
  const [detailID, setDetailID] = useState(0)
  const handleShowDetail = (e) => {
    setDetailID(Number(e.target.value));
    setShowDetail(true);
  }

  function getHouses() {
    axios.get('https://test-backend.baania.dev/home')
      .then(response => {
        setHouses(response.data.payload);

      })
  }

  function getPostCode() {
    axios.get('https://test-backend.baania.dev/postCode')
      .then(response => {
        setPostCode(response.data.payload);

      })
  }

  function getPostCodeDetail(param) {
    axios.get(`https://test-backend.baania.dev/postCode/${param}`)
      .then(response => {
        console.log('post_code detail res', response.data.payload);
        setPostCodeDetail(response.data.payload);

      })
  }


  useEffect(() => {
    getHouses();
    getPostCode();
    setItemOffset(0);
    setPageNumber(0);

  }, [])

  let endOffset = itemOffset + itemsPerPage;
  let currentItems = houses.slice(itemOffset, endOffset);
  let pageCount = Math.ceil(houses.length / itemsPerPage);

  const handleDeleteClick = (e) => {
    Swal.fire({
      title: 'Do you want to delete ?',
      icon: 'question',
      confirmButtonText: 'DELETE',
      cancelButtonText: 'CANCEL',
      confirmButtonColor: '#a71d2a',
      showCancelButton: true,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        let id = e.target.value;
        axios.delete(`https://test-backend.baania.dev/home/${id}`)
          .then(() => {
            getHouses();
            Swal.fire(
              'Success',
              'Delete successful!',
              'success'
            )
          })
          .catch(err => {
            alert(err)
          })
      }
    })
  }

  const handlePageClick = (e) => {
    let newOffset = (e.selected * itemsPerPage) % houses.length;
    console.log(newOffset);
    setItemOffset(newOffset);
    setPageNumber(e.selected);
  };

  const handlePerPageClick = (e) => {
    setItemsPerPage(Number(e.target.value))
    setItemOffset(0);
    setPageNumber(0);
  }

  const handleSelectPostCode = (e) => {
    let selectedVal = e.target.value
    console.log('selectedVal', selectedVal);
    getPostCodeDetail(selectedVal);
  }

  return (
    <>
      <div className="App">
        <div className="main_container">
          <h2>HOUSE LIST</h2>
          <button onClick={handleShow}>
            CREATE
          </button>
          {show && <ModalContent show={show} setShow={setShow} getHouses={getHouses} />}
        </div>
        <div className="table_container">
          <Table>
            <Thead className="table_header">
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Postcode</Th>
                <Th>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                currentItems.map(item => (
                  <Tr className="table_row" key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.post_code}</Td>
                    <Td>{item.price}</Td>
                    <Td className="table_button_cell">
                      <button className="table_button view_detail_btn" value={item.id} onClick={handleShowDetail}>
                        VIEW DETAIL
                      </button>
                      <button className="table_button delete_btn" value={item.id} onClick={handleDeleteClick}>
                        DELETE
                      </button>
                    </Td>
                  </Tr>
                ))
              }
              <ViewDetailModal show={showDetail} setShow={setShowDetail} getHouses={getHouses} id={detailID} />

            </Tbody>
          </Table>
        </div>
        <div className="table_pagination">
          <label className="table_pagination_option">
            Rows Per Page :
            <select onChange={handlePerPageClick}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={houses.length}>All</option>
            </select>
            <label >{itemOffset + 1} - {endOffset} of {houses.length}</label>
          </label>
          <ReactPaginate
            breakLabel="..."
            nextLabel={<FaChevronRight />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={<FaChevronLeft />}
            forcePage={pageNumber}
          />
        </div>

        <div className='select_container p-5'>
          <Form.Select aria-label="Default select example" onChange={handleSelectPostCode}>
            <option>SELECT POST CODE</option>
            {
              postCode.map((item, index) => (
                <option key={index} value={item.post_code}>{item.post_code}</option>
              ))
            }

          </Form.Select>
          {
            postCodeDetail ?
              (
                <div className='mt-2' style={{color:'blue'}}>
                  Average : {postCodeDetail?.average}
                  <br/>
                  Median :  {postCodeDetail?.median}
                </div>
              )
              :
              (<div></div>)
          }
        </div>
      </div>
    </>
  )
}

export default App
