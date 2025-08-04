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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1} className="text-6xl mb-4 text-white">
            🎪 Clown Directory 🎪
          </Title>
          <Paragraph className="text-xl text-gray-300 mb-6">
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
            className="bg-purple-600 hover:bg-purple-700 border-purple-600"
          >
            Add New Clown
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
            <div className="mt-4 text-lg text-white">Loading clowns...</div>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredClowns.length === 0 ? (
              <Col span={24}>
                <Card className="text-center py-12 bg-gray-800 border-gray-700">
                  <SmileOutlined className="text-6xl text-gray-400 mb-4" />
                  <Title level={3} className="text-gray-300">
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
                    className="h-full shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gray-800 border-gray-600 hover:border-purple-500"
                    cover={
                      <div 
                        className="h-48 flex items-center justify-center text-8xl"
                        style={{ backgroundColor: clown.color + '30' }}
                      >
                        🤡
                      </div>
                    }
                  >
                    <div className="text-center">
                      <Title level={4} className="mb-2 text-white">{clown.name}</Title>
                      <Tag color={clown.color} className="mb-2">
                        {clown.specialty}
                      </Tag>
                      <div className="mb-2">
                        <Rate disabled defaultValue={clown.rating} />
                      </div>
                      <Text className="text-gray-300 block mb-2">
                        {clown.experience} years experience
                      </Text>
                      {clown.description && (
                        <Text className="text-sm text-gray-400">
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
          title={<span className="text-white">Add New Clown</span>}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
          footer={null}
          width={600}
          className="dark-modal"
          styles={{
            content: { backgroundColor: '#1f2937', border: '1px solid #374151' },
            header: { backgroundColor: '#1f2937', borderBottom: '1px solid #374151' }
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddClown}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label={<span className="text-gray-300">Clown Name</span>}
              rules={[{ required: true, message: 'Please enter the clown name!' }]}
            >
              <Input placeholder="e.g., Bobo the Great" size="large" />
            </Form.Item>

            <Form.Item
              name="specialty"
              label={<span className="text-gray-300">Specialty</span>}
              rules={[{ required: true, message: 'Please select a specialty!' }]}
            >
              <select className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                <option value="">Select specialty...</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </Form.Item>

            <Form.Item
              name="experience"
              label={<span className="text-gray-300">Years of Experience</span>}
              rules={[{ required: true, message: 'Please enter years of experience!' }]}
            >
              <Input type="number" placeholder="5" size="large" />
            </Form.Item>

            <Form.Item
              name="rating"
              label={<span className="text-gray-300">Rating</span>}
            >
              <Rate defaultValue={5} />
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="text-gray-300">Description</span>}
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Tell us about this amazing clown..."
              />
            </Form.Item>

            <Form.Item
              name="color"
              label={<span className="text-gray-300">Theme Color</span>}
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
                  className="bg-purple-600 hover:bg-purple-700 border-purple-600"
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