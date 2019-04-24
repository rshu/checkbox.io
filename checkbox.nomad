job "Checkbox_Job" {

  datacenters = [ "dc1" ]

  group "default" {
    count = 3

    task "webservice" {
      driver = "exec"

      resources {
        memory = 512
      }

      config {
        command = "/bin/bash"
        args    = ["/home/ubuntu/startServer.sh"]
      }
    }

  }

}
