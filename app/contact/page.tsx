import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100">
            We&apos;re here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 987-6543</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      support@smartcomplaint.com
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      info@smartcomplaint.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      123 City Hall Avenue
                      <br />
                      Government District
                      <br />
                      State, 12345
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Office Hours
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      type="text"
                      placeholder="John"
                      required
                    />
                    <Input
                      label="Last Name"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />

                  <Input
                    label="Subject"
                    type="text"
                    placeholder="How can we help you?"
                    required
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Our Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Map Integration Placeholder
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
