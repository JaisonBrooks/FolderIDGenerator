// Author: Jaison Brooks
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Form,
  FormGroup,
  FormInput,
  Container,
  Row,
  Col,
  Collapse,
  ListGroup,
  ListGroupItem,
  Alert,
  Tooltip,
  FormTextarea,
} from "shards-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useForm, Controller } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { ListUl } from "react-bootstrap-icons";
import copy from 'copy-to-clipboard';
import dayjs from 'dayjs';

import { useStickyState } from "./helpers";
import "./App.css";

const ALERT_TIMEOUT = 5555;

const form = {
  title: "OG Folder Namer",
  listTitle: "History",
  fields: [
    {
      key: "price",
      label: "Price",
      component: FormInput,
      defaultValue: "",
      placeholder: "",
      rules: {
        required: true,
        maxLength: 20,
      },
    },
    {
      key: "sku",
      label: "SKU",
      component: FormInput,
      defaultValue: "",
      placeholder: "",
      rules: {
        required: true,
        maxLength: 100,
      },
    },
    {
      key: "category",
      label: "Category",
      component: FormInput,
      defaultValue: "",
      placeholder: "",
      rules: {
        required: true,
        maxLength: 250,
      },
    },
    {
      key: "description",
      label: "Description",
      component: FormTextarea,
      defaultValue: "",
      placeholder: "",
      rules: {
        required: true,
        maxLength: 250,
      },
    },
    {
      key: "weight",
      label: "Weight",
      component: FormInput,
      defaultValue: "",
      placeholder: "",
      rules: {
        required: true,
        maxLength: 50,
      },
    },
    {
      key: "size",
      label: "Size",
      component: FormInput,
      defaultValue: "",
      placeholder: "",
      rules: {
        required: true,
        maxLength: 50,
      },
    },
  ],
};

function App() {
  const { control, handleSubmit, errors } = useForm();
  const [alert, setAlert] = useState(null);
  const [showHistoryTooltip, setShowHistoryTooltip] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [folderNames, setFolderNames] = useStickyState([], "folder-names");

  const toFolderName = (data) => {
    return `@${data.price}@${data.sku}@${data.category}@${data.description}@${data.weight}@${data.size}@`;
  };

  const setCopiedAlert = (name) => {
    setAlert({
      text: name,
      subtext: 'copied to clipboard',
      type: 'success'
    });
  }

  const addToFolderNames = (name) => {
    const newFolderName = {
      value: name,
      date: dayjs().format()
    };
    setFolderNames([newFolderName].concat(folderNames));
  };

  const renderIDs = () => {
    return folderNames.map((item, index) => {
      const { date, value } = item;
      return (
        <CopyToClipboard
          text={value}
          onCopy={() => setCopiedAlert(value)}
          key={index}
        >
          <ListGroupItem key={index} className="GenerateIDCard--listGroupItem">
            {value}
            <p style={{fontSize: '1rem', fontStyle: 'italic', marginBottom: '0'}}>{date}</p>
          </ListGroupItem>
        </CopyToClipboard>
      );
    });
  };

  const onSubmit = (data) => {
    const name = toFolderName(data);
    copy(name);
    addToFolderNames(name);
    setCopiedAlert(name);
  };

  const clearIDs = () => {
    setShowHistory(false);
    setFolderNames([]);
    setAlert(null);
  };

  const renderAlert = () => {
    return (
      alert && (
        <Alert className="CopyAlert" theme="success" dismissible={() => setAlert(null)} open={alert}>
          {alert.text}
          {
            alert.subtext && <p style={{marginBottom: 0, fontSize: '1rem'}}>{alert.subtext}</p>
          }
        </Alert>
      )
    );
  };

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => {
    setAlert(null);
  }, ALERT_TIMEOUT);

  return (
    <div className="App">
      <div className="App-wrapper">
        <Container className="px-sm-2">
          <Row>
            <Col lg={{ size: 8, offset: 2 }} md={{ size: 10, offset: 1}}>
              <Card className="GenerateIDCard mt-lg-0">
                <CardHeader className="GenerateIDCard--header">
                  <p>{form.title}</p>
                  <span
                    id="showHistory"
                    className="Icon--clickable"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <Tooltip
                      open={showHistoryTooltip}
                      target="#showHistory"
                      toggle={() => setShowHistoryTooltip(!showHistoryTooltip)}
                    >
                      Click to show/hide history
                    </Tooltip>
                    <ListUl />
                  </span>
                </CardHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <CardBody className={`GenerateIDCard--cardbody ${(showHistory || alert) && 'GenerateIDCard--cardbody-expanded'}`}>
                    {form.fields.map((field, i) => {
                      const {
                        key,
                        rules,
                        component,
                        defaultValue,
                        placeholder,
                        label,
                      } = field;
                      return (
                        <FormGroup
                          className="GenerateIDCard--formGroup"
                          key={i}
                        >
                          <label htmlFor={key}>{label}</label>
                          <Controller
                            as={component}
                            name={key}
                            control={control}
                            rules={rules}
                            defaultValue={defaultValue}
                            placeholder={
                              errors[key] ? `${key} is required` : placeholder
                            }
                            invalid={errors[key] ? true : false}
                          />
                        </FormGroup>
                      );
                    })}
                    <Collapse open={alert !== null}>
                      {renderAlert()}
                    </Collapse>
                    <Collapse open={showHistory}>
                      <hr className="my-4" />
                      {folderNames.length > 0 ? (
                        <>
                          <h5 className="History--title">History</h5>
                          <ListGroup className="GenerateIDCard--listGroup">
                            {renderIDs()}
                          </ListGroup>
                          <Button className="Button--clear mt-2" theme="light" pill onClick={() => clearIDs()}>
                            Clear
                          </Button>
                        </>
                      ) : (
                        <p className="History--emptyStateText">
                          No folder names...
                        </p>
                      )}
                    </Collapse>
                  </CardBody>
                  <CardFooter>
                    <Button type="submit" className="Button--wide" pill>
                      Generate
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
