// store input
        var input = document.getElementById('inputSearch');

        // search event listeners
        document.getElementById("btnSearch").addEventListener("click", userApi);
        document.getElementById("btnSearch").addEventListener("click", reposApi);


        input.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                userApi();
                reposApi();
            }
        });


        // user and repos API URLs
        function userApi() {
            var username = input.value;
            var userURL = "https://api.github.com/users/" + username;
            callApis(userURL, displayUser, error);
        };

        function reposApi() {
            var username = input.value;
            var reposURL = "https://api.github.com/users/" + username + "/repos?per_page=100"
            callApis(reposURL, createReposTable, error);
        };

        // calling APIs to fetch different JSONs 
        function callApis(url, succeeded, failed) {
            fetch(url)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(response.statusText);
                }).then(function(json) {
                    succeeded(json);
                }).catch(function(error) {
                    console.log("Request failed " + error.message);
                    failed();
                });
        }

    
        // user API succeeded
        function displayUser(json) {
            document.getElementById('mainDiv').classList.add('grow');
            document.getElementById('errorDisplay').classList.add('hidden');
            document.getElementById('searchDisplay').classList.add('hidden');
            document.getElementById('nameDisplay').classList.remove('hidden');
            document.getElementById('tableDisplay').classList.remove('hidden');
            document.getElementById('btnRefresh').classList.remove('hidden');

            // putting JSON data in variables 
            var avatar = json.avatar_url;
            var username = json.login;
            var fullname = json.name;
            var bio = json.bio;

            // creating elements dynamically
            var img = document.createElement('img');
            var h1 = document.createElement('h1');
            var h6 = document.createElement('h6');
            var h6Bio = document.createElement('h6');

            // adding JSON data to created elements
            img.src = avatar;
            img.classList.add('avatar');
            h1.textContent = fullname;
            h6.textContent = '@' + username;
            h6Bio.textContent = bio;

            // getting HTML elements by ID 
            picFrame = document.getElementById('picFrame');
            info = document.getElementById('info');

            picFrame.innerHTML = "";
            info.innerHTML = "";
            // appending created elements to existing elements
            picFrame.appendChild(img);
            info.appendChild(h1);
            info.appendChild(h6);
            info.appendChild(h6Bio);
        }
        
        // repos API succeeded
        function createReposTable(json) {
            
            // empty tbody to display new user's repositories
            document.getElementById('tbody').innerHTML = "";

            for (var i = 0; i < json.length; i++) {

                // put data into variables
                var reposName = json[i].name;
                var starsCount = json[i].stargazers_count;
                var forksCount = json[i].forks_count;

                // create table elements
                var row = document.createElement("tr");
                var tdName = document.createElement("td");
                tdName.classList.add('td-name');
                var tdStats = document.createElement("td");
                tdStats.classList.add('td-stats');

                // create elements and store images
                var starImg = document.createElement("img");
                starImg.classList.add('icon');
                var forkImg = document.createElement("img");
                forkImg.classList.add('icon');
                forkImg.src = "http://timhettler.github.io/sassconf-2015/slides/assets/svg/fork.svg";
                starImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Octicons-star.svg/2000px-Octicons-star.svg.png";
                
                // dynamically set th content
                document.querySelector('th').textContent = "Repositories";

                // append elements to cells
                tdName.append(reposName);
                tdStats.append(starImg);
                tdStats.append(starsCount);
                tdStats.append(forkImg);
                tdStats.append(forksCount);

                // append cells to row
                row.append(tdName);
                row.append(tdStats);

                // append row to tbody
                document.getElementById('tbody').append(row);
            }
        }

        // user not found
        function error() {
            document.getElementById("errorDisplay").classList.remove("hidden");
            document.getElementById("tableDisplay").classList.add("hidden");
            document.getElementById("nameDisplay").classList.add("hidden");
        }