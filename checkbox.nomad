job "Checkbox_Job" {

  datacenters = [ "dc1" ]

  group "default" {
    count = 3

    task "webservice" {
      driver = "docker"

 #     resources {
 #       memory = 512
 #     }

      config {
	image = "tamitito/marqdown"
	#network_mode = "host"
      }

      resources {
	network {
	  port "marqdown" {
	     static = 9001
	  }
	}
      }

    }

  }

}
