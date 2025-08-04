import { useState, useEffect } from 'react'
import { Card, Button, Input, Space, Typography, Row, Col, Avatar, Tag, Modal, Form, Rate, Spin } from 'antd'
import { SmileOutlined, StarOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Clown } from '../entities/Clown'

const { Title, Text, Paragraph } = Typography
const { Search } = Input

function ClownApp() {
  const [clowns, setClowns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadClowns()
  }, [])

  const loadClowns = async () => {
    try {
      setLoading(true)
      const response = await Clown.list()
      if (response.success) {
        setClowns(response.data)
      }
    } catch (error) {
      console.error('Error loading clowns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClown = async (values) => {
    try {
      const response = await Clown.create({
        name: values.name,
        specialty: values.specialty,
        experience: values.experience,
        rating: values.rating || 5,
        description: values.description,
        color: values.color || '#ff6b6b'
      })
      
      if (response.success) {
        setClowns([...clowns, response.data])
        setIsModalVisible(false)
        form.resetFields()
      }
    } catch (error) {
      console.error('Error adding clown:', error)
    }
  }

  const filteredClowns = clowns.filter(clown =>
    clown.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clown.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const specialties = ['Balloon Artist', 'Juggler', 'Magic', 'Face Painter', 'Entertainer', 'Comedy']

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1} className="text-6xl mb-4">
            🎪 Clown Directory 🎪
          </Title>
          <Paragraph className="text-xl text-gray-600 mb-6">
            Welcome to the most entertaining clown directory! Meet our amazing performers.
          </Paragraph>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Search
            placeholder="Search clowns by name or specialty..."
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            className="max-w-md"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="bg-red-500 hover:bg-red-600 border-red-500"
          >
            Add New Clown
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
            <div className="mt-4 text-lg">Loading clowns...</div>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredClowns.length === 0 ? (
              <Col span={24}>
                <Card className="text-center py-12">
                  <SmileOutlined className="text-6xl text-gray-400 mb-4" />
                  <Title level={3} className="text-gray-500">
                    {searchTerm ? 'No clowns found matching your search' : 'No clowns yet!'}
                  </Title>
                  <Text className="text-gray-400">
                    {searchTerm ? 'Try a different search term' : 'Add the first clown to get started'}
                  </Text>
                </Card>
              </Col>
            ) : (
              filteredClowns.map((clown) => (
                <Col xs={24} sm={12} md={8} lg={6} key={clown._id}>
                  <Card
                    hoverable
                    className="h-full shadow-lg border-2 hover:shadow-xl transition-all duration-300"
                    cover={
                      <div 
                        className="h-48 flex items-center justify-center text-8xl"
                        style={{ backgroundColor: clown.color + '20' }}
                      >
                        🤡
                      </div>
                    }
                  >
                    <div className="text-center">
                      <Title level={4} className="mb-2">{clown.name}</Title>
                      <Tag color={clown.color} className="mb-2">
                        {clown.specialty}
                      </Tag>
                      <div className="mb-2">
                        <Rate disabled defaultValue={clown.rating} />
                      </div>
                      <Text className="text-gray-600 block mb-2">
                        {clown.experience} years experience
                      </Text>
                      {clown.description && (
                        <Text className="text-sm text-gray-500">
                          {clown.description}
                        </Text>
                      )}
                    </div>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}

        <Modal
          title="Add New Clown"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddClown}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Clown Name"
              rules={[{ required: true, message: 'Please enter the clown name!' }]}
            >
              <Input placeholder="e.g., Bobo the Great" size="large" />
            </Form.Item>

            <Form.Item
              name="specialty"
              label="Specialty"
              rules={[{ required: true, message: 'Please select a specialty!' }]}
            >
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="">Select specialty...</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </Form.Item>

            <Form.Item
              name="experience"
              label="Years of Experience"
              rules={[{ required: true, message: 'Please enter years of experience!' }]}
            >
              <Input type="number" placeholder="5" size="large" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
            >
              <Rate defaultValue={5} />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Tell us about this amazing clown..."
              />
            </Form.Item>

            <Form.Item
              name="color"
              label="Theme Color"
            >
              <Input type="color" defaultValue="#ff6b6b" className="w-20 h-10" />
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => {
                  setIsModalVisible(false)
                  form.resetFields()
                }}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  className="bg-red-500 hover:bg-red-600 border-red-500"
                >
                  Add Clown
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default ClownApp