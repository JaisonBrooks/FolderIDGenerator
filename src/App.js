// Author: Jaison Brooks
import React, { useState } from "react";
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
  ListGroup,
  ListGroupItem,
  Alert,
  FormFeedback,
  FormTextarea,
} from "shards-react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useForm, Controller } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import { useInterval, useStickyState } from './helpers';
import "./App.css";

const form = {
  title: 'OG Folder Namer',
  listTitle: 'Generated Names',
  fields: [
    {
      key: 'price',
      label: 'Price',
      component: FormInput,
      defaultValue: '',
      placeholder: '',
      rules: {
        required: true,
        maxLength: 20,
      }
    },
    {
      key: 'sku',
      label: 'SKU',
      component: FormInput,
      defaultValue: '',
      placeholder: '',
      rules: {
        required: true,
        maxLength: 100,
      }
    },
    {
      key: 'category',
      label: 'Category',
      component: FormTextarea,
      defaultValue: '',
      placeholder: '',
      rules: {
        required: true,
        maxLength: 250,
      }
    },
    {
      key: 'description',
      label: 'Description',
      component: FormTextarea,
      defaultValue: '',
      placeholder: '',
      rules: {
        required: true,
        maxLength: 250,
      }
    },
    {
      key: 'weight',
      label: 'Weight',
      component: FormInput,
      defaultValue: '',
      placeholder: '',
      rules: {
        required: true,
        maxLength: 50,
      }
    },
    {
      key: 'size',
      label: 'Size',
      component: FormInput,
      defaultValue: '',
      placeholder: '',
      rules: {
        required: true,
        maxLength: 50,
      }
    },
  ],
}

function App() {
  const { control, handleSubmit, errors } = useForm();
  const [alert, setAlert] = useState(null);
  const [ids, setIds] = useStickyState([], 'folder-names')

  const newID = (data) => {
    return `@${data.price}@${data.sku}@${data.category}@${data.description}@${data.weight}@${data.size}@`;
  }

  const addToIDs = (data) => {
    setIds(ids.concat(newID(data)));
  };

  const renderIDs = () => {
    return ids.map((item, index) => {
      return (
          <CopyToClipboard text={item} onCopy={() => setAlert(`${item} copied!`)} key={index}>
            <ListGroupItem key={index} className="GenerateIDCard--listGroupItem">{item}</ListGroupItem>
          </CopyToClipboard>
      );
    });
  };

  const onSubmit = (data) => {
    addToIDs(data);
  }

  const clearIDs = () => {
    setIds([]);
    setAlert(null);
  }

  const renderAlert = () => {
    return alert && <Alert theme="success">{alert}</Alert>
  }

  useInterval(() => {
    setAlert(null);
  }, 3000);

  return (
    <div className="App">
      <div className="App-wrapper">
        <Container>
          <Row>
            <Col lg="6">
              <Card className="GenerateIDCard mt-lg-0">
                <CardHeader>{form.title}</CardHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                <CardBody className="GenerateIDCard--cardbody">
                    {
                      form.fields.map((field, i) => {
                        const { key, rules, component, defaultValue, placeholder, label } = field;
                        return <FormGroup className="GenerateIDCard--formGroup" key={i}>
                          <label htmlFor={key}>{label}</label>
                          <Controller 
                            as={component}
                            name={key} 
                            control={control} 
                            rules={rules} 
                            defaultValue={defaultValue}
                            placeholder={errors[key] ? `${key} is required` : placeholder}
                            invalid={errors[key] ? true : false}
                          />
                        </FormGroup>
                      })
                    }
                    <FormFeedback valid={false}></FormFeedback>
                </CardBody>
                <CardFooter>
                  <Button type="submit" className="Button--wide" pill>Generate</Button>
                </CardFooter>
                </Form>
              </Card>
            </Col>
            <Col lg="6">
                  <Card className="GenerateIDCard GenerateIDCard--list mt-lg-0">
                    <CardHeader>
                      {form.listTitle}
                    </CardHeader>
                    {ids.length > 0 ? (
                      <>
                        {renderAlert()}
                        <ListGroup className="GenerateIDCard--listGroup">
                          {renderIDs()}
                        </ListGroup>
                        <CardFooter>
                          <Button className="Button--wide" pill theme="light" onClick={() => clearIDs()}>
                            Clear
                          </Button>
                        </CardFooter>
                      </>
                    ) : <p style={{padding: '1rem', margin: 0, textAlign: 'center', color: '#a0a0a0', fontSize: '18px', fontStyle: 'italic'}}>No names created</p>}
                  </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
