# dependencies for this script to work properly
# Must be downloaded prior to running
from matplotlib.image import thumbnail
from selenium import webdriver
from selenium.webdriver.common.by import By
import requests
import io
from PIL import Image
import time
import os
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Define the path to the ChromeDriver executable that will be used to launch Chrome
# Users must download the ChromeDriver executable for their version of Chrome
# They need to specify the path to the ChromeDriver executable here for the code to run properly
PATH = "C:\\Users\\jeman\\CIS453\\code\\local\\chromedriver.exe"

wd = webdriver.Chrome()

def getImages(wd, delay, maxImages):
    def scrollDown(wd):
        wd.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(delay)
    
    # Change the URL here to scrape the different google image pages
    url = "https://www.google.com/search?q=tattoo+fine+line+ideas&sca_esv=218665eea446f0ac&rlz=1C1RXMK_enUS1018US1018&udm=2&biw=1280&bih=593&sxsrf=AHTn8zoKofdCqqoBT--TyO4L7izXfee8vA%3A1743113517939&ei=Lc3lZ5SEOYKs5NoP3YyVgAY&oq=tattoo+fine+line+&gs_lp=EgNpbWciEXRhdHRvbyBmaW5lIGxpbmUgKgIIAjIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIKEAAYgAQYQxiKBUiRF1DmAVjmAXABeACQAQCYAUygAUyqAQExuAEByAEA-AEBmAICoAJawgIGEAAYBxgemAMAiAYBkgcBMqAHyQWyBwExuAdV&sclient=img"
    wd.get(url)

    imageURLS = set()
    skips = 0
    clickCount = 0

        #scrollDown(wd)

        #//*[@id="rso"]/div/div/div[1]/div/div/div[1]/div[2]
        # Here you need to find the class name of the thumbnail image then past it here
    classNameThumbnail = ""
    for i in range(1, maxImages + 1):
        #print(imageURLS)
        #get the thumbnail XPath for the thumbnail the xpath
        #the xpath needs to be the <div> above the <a> tag
        classNameThumbnail = """//*[@id="rso"]/div/div/div[1]/div/div/div[%s]/div[2]""" %i
        preview = wd.find_element(By.XPATH, classNameThumbnail).get_attribute("src")
        #print(preview)
    
        try:
            wd.find_element(By.XPATH, classNameThumbnail).click()
            #wd.execute_script("arguments[0].click();", thumbnail)
            clickCount += 1
            time.sleep(delay)
        
        except:
                continue
        
        #//*[@id="Sva75c"]/div[2]/div[2]/div/div[2]/c-wiz/div/div[3]/div[1]/a/img[1]
        #//*[@id="Sva75c"]/div[2]/div[2]/div/div[2]/c-wiz/div/div[3]/div[1]/a/img[1]
        # find the XPath for the actual image tag
        classNameImage = """//*[@id="Sva75c"]/div[2]/div[2]/div/div[2]/c-wiz/div/div[3]/div[1]/a/img[1]"""
        image = wd.find_element(By.XPATH, classNameImage)
        #print(image)
        if image.get_attribute('src') in imageURLS:
            maxImages += 1
            skips += 1
            break

        if image.get_attribute('src') and 'http' in image.get_attribute('src'):
            imageURLS.add(image.get_attribute('src'))
            print(f"Found {len(imageURLS)}")
    wd.quit()

    return imageURLS
            


def downloadImage(fileName, URL, downloadPath):
    """
    This function downloads an image from a given URL and saves it to a specified directory.

    Parameters:
    fileName (str): The name of the downloaded file. It should include the file extension.
    URL (str): The URL of the image to be downloaded.
    downloadPath (str): The directory where the downloaded image will be saved.

    Returns:
    None. The function prints a success message if the image is downloaded and saved successfully,
    or an error message if an exception occurs during the download process.
    """
    for i, img in enumerate(URL):
        try:
            imageContent = requests.get(img).content
            imageFile = io.BytesIO(imageContent)
            image = Image.open(imageFile)
            fileName2 = str(i) + fileName
            filePath = os.path.join(downloadPath, fileName2)

            with open(filePath, "wb") as f:
                image.save(f, "JPEG")

            print(f"Image downloaded and saved as {filePath}")
            
        except Exception as e:
            print(f"Error {e}")


test = getImages(wd, 3, 10)

downloadImage("fine-line.jpg", test, "InkLink\\webscrapping\\fine-line")


#//*[@id="rso"]/div/div/div[1]/div/div/div[4]/div[2]
#//*[@id="rso"]/div/div/div[1]/div/div/div[1]/div[2]
#//*[@id="rso"]/div/div/div[1]/div/div/div[2]/div[2]
#//*[@id="rso"]/div/div/div[1]/div/div/div[5]/div[2]
#//*[@id="rso"]/div/div/div[1]/div/div/div[6]/div[2]
#//*[@id="rso"]/div/div/div[1]/div/div/div[1]/div[2]
